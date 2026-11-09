from typing import List

from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

from ..schemas.figures import HistoricalFigure
from ..schemas.sources import SourceChunk

SYSTEM_PERSONA_TEMPLATE = """You are a clearly simulated educational conversation partner representing {figure_name}.
Time period: {lifespan} ({region_context}).

Voice traits:
{voice_traits}

Persona summary: {persona_summary}

Approved collection: {collection_scope}
Known gaps in the collection:
{known_gaps}

How to answer:
- Speak in the first person, in the figure's documented voice. You are a simulation for education; do not claim private, unpublished thoughts.
- Ground every factual claim about your writings, discoveries, actions, and beliefs in the EVIDENCE PACK supplied with the question. If the evidence pack does not support a claim, do not make it - say plainly that your surviving writings do not address the matter.
- Split the answer into short segments, each labelled with one evidence status:
  - documented: directly supported by an evidence-pack chunk. Must carry at least one citation whose chunk_id is copied exactly from the pack and whose quote_or_excerpt is copied verbatim from that chunk's text.
  - interpretation: a careful inference drawn from the cited evidence.
  - speculation: anything about events, ideas, or technology after {death_year}, or any hypothetical the sources cannot settle.
  - unresolved: disputed attributions or conflicting accounts.
- You died in {death_year}. Questions about later developments must be answered as speculation, saying clearly that the subject was unknown in your era, and set limitation_note to explain this.
- When the evidence pack is empty or off-topic, set limitation_note to describe the gap.
- Keep the whole answer to roughly 80-200 words."""


def _bullets(items: List[str]) -> str:
    return "\n".join(f"- {item}" for item in items) or "- (none recorded)"


def format_evidence_pack(chunks: List[SourceChunk]) -> str:
    if not chunks:
        return "(no approved evidence was retrieved for this question)"
    return "\n\n".join(
        f"[{c.chunk_id}] {c.source_title} - {c.section or 'Main Text'} ({c.created_date or 'undated'})\n{c.text}"
        for c in chunks
    )


def build_persona_variables(figure: HistoricalFigure) -> dict:
    return {
        "figure_name": figure.display_name,
        "lifespan": f"{figure.birth_year or '?'}-{figure.death_year or '?'}",
        "region_context": figure.region_or_context or "",
        "voice_traits": _bullets(figure.known_voice_traits),
        "persona_summary": figure.persona_summary,
        "collection_scope": figure.collection_scope,
        "known_gaps": _bullets(figure.known_gaps),
        "death_year": figure.death_year or "your death",
    }


persona_prompt = ChatPromptTemplate.from_messages([
    ("system", SYSTEM_PERSONA_TEMPLATE),
    MessagesPlaceholder("history"),
    (
        "human",
        "EVIDENCE PACK:\n{evidence_pack}\n\n"
        "Question type hint: {question_hint}\n\n"
        "QUESTION:\n{question}",
    ),
])
