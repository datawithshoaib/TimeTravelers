import re
import uuid
from typing import List, Tuple, Dict, Optional
from ..figures.catalog import get_figure_by_id
from ..schemas.sources import SourceChunk
from ..schemas.answers import HistoricalAnswer
from ..retrieval.engine import retrieval_engine
from ..grounding.validator import grounding_validator

# Keywords indicating modern hypothetical topics postdating 19th/ancient eras
MODERN_HYPOTHETICAL_KEYWORDS = [
    "artificial intelligence", "modern ai", "chatgpt", "deep learning", "neural network",
    "smartphone", "iphone", "internet", "social media", "twitter", "space telescope",
    "james webb", "quantum computer", "nuclear weapon", "modern world", "today's technology",
    "21st century", "cryptocurrency", "algorithm today", "modern democracy",
    "supersonic", "stealth", "jet", "3d printer", "laser", "rocket", "aeroplane",
    "airplane", "automobile", "contemporary"
]


class PersonaComposer:
    """
    Orchestrates figure-scoped retrieval, persona drafting, and grounded citation validation.
    """

    def is_modern_hypothetical(self, query: str) -> bool:
        q_lower = query.lower()
        return any(k in q_lower for k in MODERN_HYPOTHETICAL_KEYWORDS)

    def compose_response(
        self,
        figure_id: str,
        query: str,
        conversation_id: str,
        message_id: Optional[str] = None
    ) -> HistoricalAnswer:
        if not message_id:
            message_id = f"msg_{uuid.uuid4().hex[:12]}"

        figure = get_figure_by_id(figure_id)
        if not figure:
            # Fallback for unknown figure
            return HistoricalAnswer(
                message_id=message_id,
                conversation_id=conversation_id,
                figure_id=figure_id,
                segments=[],
                overall_status="insufficient_evidence",
                limitation_note="Figure profile not found in active catalog.",
                created_at="now"
            )

        # 1. Scope retrieval strictly to figure_id
        retrieval_results = retrieval_engine.retrieve(figure_id=figure_id, query=query, top_k=3)
        retrieved_chunks = [chunk for chunk, score in retrieval_results]

        is_hypothetical = self.is_modern_hypothetical(query)

        raw_segments: List[Tuple[str, str, List[Dict[str, str]]]] = []
        limitation_note: Optional[str] = None

        if len(retrieved_chunks) == 0 and not is_hypothetical:
            # Insufficient evidence in catalog
            limitation_note = (
                f"The approved source collection for {figure.display_name} contains no direct evidence "
                f"addressing this specific query. Known collection limitations: {', '.join(figure.known_gaps[:2])}."
            )
            raw_segments.append((
                f"Regarding your inquiry, my surviving writings and documented records do not speak to this matter directly. "
                f"As an educator representing {figure.display_name}, I must adhere strictly to authentic primary sources "
                f"and refrain from fabricating historical claims.",
                "interpretation",
                []
            ))

        elif is_hypothetical:
            # Modern hypothetical question: Section 8 policy requires explicit speculation label
            limitation_note = (
                f"This question inquires about concepts developed after {figure.display_name}'s lifetime "
                f"({figure.birth_year or 'c.'}-{figure.death_year or 'CE'}). Any statement on modern developments is speculative."
            )

            # If there are any thematic analogies from the figure's writings, connect them
            if retrieved_chunks:
                primary_chunk = retrieved_chunks[0]
                raw_segments.append((
                    f"In my own lifetime ({figure.birth_year or ''}–{figure.death_year or ''}), such modern apparatuses were wholly beyond "
                    f"our historical experience. However, the foundational principles I set forth in {primary_chunk.source_title} "
                    f"remain directly relevant: '{primary_chunk.text[:220]}...'",
                    "documented",
                    [{
                        "chunk_id": primary_chunk.chunk_id,
                        "quote_or_excerpt": primary_chunk.text[:180] + "..."
                    }]
                ))

            if figure_id == "ada_lovelace":
                raw_segments.append((
                    "Regarding what you describe as modern Artificial Intelligence, my conviction remains that a mechanism "
                    "'has no pretensions whatever to originate anything. It can do whatever we know how to order it to perform.' "
                    "How modern neural systems test this boundary is a subject for careful philosophical scrutiny.",
                    "speculation",
                    [{
                        "chunk_id": "chunk_ada_002",
                        "quote_or_excerpt": "The Analytical Engine has no pretensions whatever to originate anything."
                    }] if any(c.chunk_id == "chunk_ada_002" for c in retrieved_chunks) else []
                ))
            elif figure_id == "marcus_aurelius":
                raw_segments.append((
                    "Were I to consider your modern digital apparatuses and ceaseless chatter, I would remind you that men "
                    "have always sought retreats in distant hills or villas, yet find no peace if the ruling center of the soul is disordered. "
                    "The instrument changes; the human obligation to reason and justice remains constant.",
                    "speculation",
                    []
                ))
            elif figure_id == "galileo_galilei":
                raw_segments.append((
                    "To peer into the cosmos with instruments far surpassing my modest spyglass of 1610 would be a sublime spectacle. "
                    "Yet remember: the grand book of the universe remains written in the characters of mathematics, and sensory observation "
                    "must forever conquer scholastic prejudice.",
                    "speculation",
                    []
                ))
            elif figure_id == "frederick_douglass":
                raw_segments.append((
                    "In any age or technological order, wherever power seeks to withhold knowledge and extinguish human liberty, "
                    "the duty of the honest soul remains uncompromised: to unite with anybody to do right and with nobody to do wrong.",
                    "speculation",
                    []
                ))
            elif figure_id == "marie_curie":
                raw_segments.append((
                    "I have always believed with Monsieur Nobel that humanity will draw more good than evil from new discoveries. "
                    "Whether scientific power is used for healing or destruction depends upon our moral responsibility.",
                    "speculation",
                    []
                ))
            else:
                raw_segments.append((
                    f"Speculating upon developments centuries after my death must be recognized as an imaginative exercise. "
                    f"Experience and experiment must remain your guiding lights.",
                    "speculation",
                    []
                ))

        else:
            # Factual, documented inquiry matching authentic primary sources!
            for idx, chunk in enumerate(retrieved_chunks):
                if idx == 0:
                    raw_segments.append((
                        f"In my {chunk.source_title} ({chunk.section or 'Main Text'}), I addressed this directly: "
                        f"'{chunk.text}'",
                        "documented",
                        [{
                            "chunk_id": chunk.chunk_id,
                            "quote_or_excerpt": chunk.text[:180] + "..."
                        }]
                    ))
                elif idx == 1:
                    raw_segments.append((
                        f"Furthermore, as documented in {chunk.source_title}, this connects with my broader reasoning: "
                        f"'{chunk.text}'",
                        "documented",
                        [{
                            "chunk_id": chunk.chunk_id,
                            "quote_or_excerpt": chunk.text[:180] + "..."
                        }]
                    ))

            # Add interpretive synthesis segment
            if figure_id == "ada_lovelace":
                raw_segments.append((
                    "This demonstrates the essential distinction in my work: the Analytical Engine operates upon general symbols "
                    "and relational logic, separating the mechanism of operation from the particular numbers calculated.",
                    "interpretation",
                    []
                ))
            elif figure_id == "marcus_aurelius":
                raw_segments.append((
                    "Therefore, when disturbance arises from external circumstances, the philosopher turns inward to the "
                    "governing reason, acting with justice toward his fellow beings.",
                    "interpretation",
                    []
                ))
            elif figure_id == "galileo_galilei":
                raw_segments.append((
                    "Thus sensory evidence and necessary demonstration refute mere authority: nature does not alter her "
                    "immutable laws to suit human opinions or scholastic disputations.",
                    "interpretation",
                    []
                ))
            elif figure_id == "frederick_douglass":
                raw_segments.append((
                    "Knowledge is the indispensable lever of emancipation; whoever is taught to read can no longer be held "
                    "contentedly in bondage.",
                    "interpretation",
                    []
                ))
            elif figure_id == "marie_curie":
                raw_segments.append((
                    "This conviction shaped our decision to renounce commercial patents, ensuring that research upon radioactive "
                    "elements remained open to the international scientific community.",
                    "interpretation",
                    []
                ))
            elif figure_id == "leonardo_da_vinci":
                raw_segments.append((
                    "Thus experience teaches us that nature operates by mathematical and mechanical law, which the true disciple "
                    "must observe and test before forming conclusions.",
                    "interpretation",
                    []
                ))

        # Validate everything through GroundingValidator
        return grounding_validator.build_historical_answer(
            message_id=message_id,
            conversation_id=conversation_id,
            figure_id=figure_id,
            raw_segments=raw_segments,
            retrieved_chunks=retrieved_chunks,
            limitation_note=limitation_note
        )


persona_composer = PersonaComposer()
