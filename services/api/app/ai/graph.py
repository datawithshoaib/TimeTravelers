"""
LangGraph workflow for one conversational turn:

    load_figure ──► classify ──► retrieve ──► draft ──► validate ──► END
         │
         └─(unknown figure)──► not_found ──► END

`draft` uses Claude (via LangChain structured output) when an API key is
configured, and the deterministic offline drafter otherwise. Whatever the
drafter produces, `validate` re-checks every citation against the chunks
retrieved for this figure in this turn before anything reaches the client.
"""
import logging
import uuid
from datetime import datetime, timezone
from typing import Dict, List, Optional, Sequence, Tuple, TypedDict

from langchain_core.messages import BaseMessage
from langgraph.graph import END, START, StateGraph

from ..figures.catalog import get_figure_by_id
from ..grounding.validator import grounding_validator
from ..schemas.answers import HistoricalAnswer
from ..schemas.figures import HistoricalFigure
from ..schemas.sources import SourceChunk
from .fallback import draft_offline
from .llm import get_drafting_model
from .prompts import build_persona_variables, format_evidence_pack, persona_prompt
from .retriever import FigureScopedRetriever, documents_to_chunks
from .schemas import DraftAnswer

logger = logging.getLogger("timetravelers.ai")

RawSegment = Tuple[str, str, List[Dict[str, str]]]

# Keywords indicating modern hypothetical topics postdating the figures' eras
MODERN_HYPOTHETICAL_KEYWORDS = [
    "artificial intelligence", "modern ai", "chatgpt", "deep learning", "neural network",
    "smartphone", "iphone", "internet", "social media", "twitter", "space telescope",
    "james webb", "quantum computer", "nuclear weapon", "modern world", "today's technology",
    "21st century", "cryptocurrency", "algorithm today", "modern democracy",
    "supersonic", "stealth", "jet", "3d printer", "laser", "rocket", "aeroplane",
    "airplane", "automobile", "contemporary"
]


class TurnState(TypedDict, total=False):
    figure_id: str
    query: str
    conversation_id: str
    message_id: str
    history: Sequence[BaseMessage]

    figure: Optional[HistoricalFigure]
    is_hypothetical: bool
    chunks: List[SourceChunk]
    raw_segments: List[RawSegment]
    limitation_note: Optional[str]
    drafted_by: str
    answer: HistoricalAnswer


def is_modern_hypothetical(query: str) -> bool:
    q_lower = query.lower()
    return any(k in q_lower for k in MODERN_HYPOTHETICAL_KEYWORDS)


def load_figure(state: TurnState) -> TurnState:
    return {"figure": get_figure_by_id(state["figure_id"])}


def route_after_load(state: TurnState) -> str:
    return "classify" if state.get("figure") else "not_found"


def not_found(state: TurnState) -> TurnState:
    return {
        "answer": HistoricalAnswer(
            message_id=state["message_id"],
            conversation_id=state["conversation_id"],
            figure_id=state["figure_id"],
            segments=[],
            overall_status="insufficient_evidence",
            limitation_note="Figure profile not found in active catalog.",
            created_at=datetime.now(timezone.utc).isoformat(),
        )
    }


def classify(state: TurnState) -> TurnState:
    return {"is_hypothetical": is_modern_hypothetical(state["query"])}


def retrieve(state: TurnState) -> TurnState:
    figure = state["figure"]
    retriever = FigureScopedRetriever(figure_id=figure.figure_id, top_k=3)
    chunks = documents_to_chunks(retriever.invoke(state["query"]))

    limitation_note: Optional[str] = None
    if state["is_hypothetical"]:
        limitation_note = (
            f"This question inquires about concepts developed after {figure.display_name}'s lifetime "
            f"({figure.birth_year or 'c.'}-{figure.death_year or 'CE'}). Any statement on modern developments is speculative."
        )
    elif not chunks:
        limitation_note = (
            f"The approved source collection for {figure.display_name} contains no direct evidence "
            f"addressing this specific query. Known collection limitations: {', '.join(figure.known_gaps[:2])}."
        )
    return {"chunks": chunks, "limitation_note": limitation_note}


def _draft_with_llm(state: TurnState) -> Optional[DraftAnswer]:
    model = get_drafting_model()
    if model is None:
        return None
    figure = state["figure"]
    chain = persona_prompt | model
    hint = (
        "modern or post-lifetime topic - answer as speculation"
        if state["is_hypothetical"]
        else "historical question - ground it in the evidence pack"
    )
    try:
        return chain.invoke({
            **build_persona_variables(figure),
            "history": list(state.get("history") or []),
            "evidence_pack": format_evidence_pack(state["chunks"]),
            "question_hint": hint,
            "question": state["query"],
        })
    except Exception:
        logger.exception("LLM drafting failed; falling back to offline drafter")
        return None


def draft(state: TurnState) -> TurnState:
    llm_draft = _draft_with_llm(state)
    if llm_draft is not None and llm_draft.segments:
        segments: List[RawSegment] = [
            (s.text, s.evidence_status, [c.model_dump() for c in s.citations])
            for s in llm_draft.segments
        ]
        # Deterministic limitation notes (anachronism / empty retrieval) take precedence
        note = state.get("limitation_note") or llm_draft.limitation_note
        return {"raw_segments": segments, "limitation_note": note, "drafted_by": "llm"}

    segments = draft_offline(state["figure"], state["chunks"], state["is_hypothetical"])
    return {"raw_segments": segments, "drafted_by": "offline"}


def validate(state: TurnState) -> TurnState:
    answer = grounding_validator.build_historical_answer(
        message_id=state["message_id"],
        conversation_id=state["conversation_id"],
        figure_id=state["figure_id"],
        raw_segments=state["raw_segments"],
        retrieved_chunks=state["chunks"],
        limitation_note=state.get("limitation_note"),
    )
    return {"answer": answer}


def build_conversation_graph():
    graph = StateGraph(TurnState)
    graph.add_node("load_figure", load_figure)
    graph.add_node("not_found", not_found)
    graph.add_node("classify", classify)
    graph.add_node("retrieve", retrieve)
    graph.add_node("draft", draft)
    graph.add_node("validate", validate)

    graph.add_edge(START, "load_figure")
    graph.add_conditional_edges("load_figure", route_after_load, ["classify", "not_found"])
    graph.add_edge("not_found", END)
    graph.add_edge("classify", "retrieve")
    graph.add_edge("retrieve", "draft")
    graph.add_edge("draft", "validate")
    graph.add_edge("validate", END)
    return graph.compile()


conversation_graph = build_conversation_graph()


def run_conversation_graph(
    figure_id: str,
    query: str,
    conversation_id: str,
    message_id: Optional[str] = None,
    history: Optional[Sequence[BaseMessage]] = None,
) -> HistoricalAnswer:
    final_state = conversation_graph.invoke({
        "figure_id": figure_id,
        "query": query,
        "conversation_id": conversation_id,
        "message_id": message_id or f"msg_{uuid.uuid4().hex[:12]}",
        "history": list(history or []),
    })
    return final_state["answer"]
