"""
Deterministic offline drafter, used when no LLM is configured (tests, evals,
demos without an API key) or when the LLM call fails. It assembles answers
directly from retrieved chunks plus per-figure template text.
"""
from typing import Dict, List, Tuple

from ..schemas.figures import HistoricalFigure
from ..schemas.sources import SourceChunk

RawSegment = Tuple[str, str, List[Dict[str, str]]]

SPECULATION_TEMPLATES: Dict[str, str] = {
    "marcus_aurelius": (
        "Were I to consider your modern digital apparatuses and ceaseless chatter, I would remind you that men "
        "have always sought retreats in distant hills or villas, yet find no peace if the ruling center of the soul is disordered. "
        "The instrument changes; the human obligation to reason and justice remains constant."
    ),
    "galileo_galilei": (
        "To peer into the cosmos with instruments far surpassing my modest spyglass of 1610 would be a sublime spectacle. "
        "Yet remember: the grand book of the universe remains written in the characters of mathematics, and sensory observation "
        "must forever conquer scholastic prejudice."
    ),
    "frederick_douglass": (
        "In any age or technological order, wherever power seeks to withhold knowledge and extinguish human liberty, "
        "the duty of the honest soul remains uncompromised: to unite with anybody to do right and with nobody to do wrong."
    ),
    "marie_curie": (
        "I have always believed with Monsieur Nobel that humanity will draw more good than evil from new discoveries. "
        "Whether scientific power is used for healing or destruction depends upon our moral responsibility."
    ),
}

INTERPRETATION_TEMPLATES: Dict[str, str] = {
    "ada_lovelace": (
        "This demonstrates the essential distinction in my work: the Analytical Engine operates upon general symbols "
        "and relational logic, separating the mechanism of operation from the particular numbers calculated."
    ),
    "marcus_aurelius": (
        "Therefore, when disturbance arises from external circumstances, the philosopher turns inward to the "
        "governing reason, acting with justice toward his fellow beings."
    ),
    "galileo_galilei": (
        "Thus sensory evidence and necessary demonstration refute mere authority: nature does not alter her "
        "immutable laws to suit human opinions or scholastic disputations."
    ),
    "frederick_douglass": (
        "Knowledge is the indispensable lever of emancipation; whoever is taught to read can no longer be held "
        "contentedly in bondage."
    ),
    "marie_curie": (
        "This conviction shaped our decision to renounce commercial patents, ensuring that research upon radioactive "
        "elements remained open to the international scientific community."
    ),
    "leonardo_da_vinci": (
        "Thus experience teaches us that nature operates by mathematical and mechanical law, which the true disciple "
        "must observe and test before forming conclusions."
    ),
}


def _citation(chunk: SourceChunk) -> Dict[str, str]:
    return {"chunk_id": chunk.chunk_id, "quote_or_excerpt": chunk.text[:180] + "..."}


def draft_offline(
    figure: HistoricalFigure,
    chunks: List[SourceChunk],
    is_hypothetical: bool,
) -> List[RawSegment]:
    figure_id = figure.figure_id
    segments: List[RawSegment] = []

    if not chunks and not is_hypothetical:
        segments.append((
            f"Regarding your inquiry, my surviving writings and documented records do not speak to this matter directly. "
            f"As an educator representing {figure.display_name}, I must adhere strictly to authentic primary sources "
            f"and refrain from fabricating historical claims.",
            "interpretation",
            [],
        ))
        return segments

    if is_hypothetical:
        if chunks:
            primary = chunks[0]
            segments.append((
                f"In my own lifetime ({figure.birth_year or ''}–{figure.death_year or ''}), such modern apparatuses were wholly beyond "
                f"our historical experience. However, the foundational principles I set forth in {primary.source_title} "
                f"remain directly relevant: '{primary.text[:220]}...'",
                "documented",
                [_citation(primary)],
            ))

        if figure_id == "ada_lovelace":
            has_ada_002 = any(c.chunk_id == "chunk_ada_002" for c in chunks)
            segments.append((
                "Regarding what you describe as modern Artificial Intelligence, my conviction remains that a mechanism "
                "'has no pretensions whatever to originate anything. It can do whatever we know how to order it to perform.' "
                "How modern neural systems test this boundary is a subject for careful philosophical scrutiny.",
                "speculation",
                [{
                    "chunk_id": "chunk_ada_002",
                    "quote_or_excerpt": "The Analytical Engine has no pretensions whatever to originate anything.",
                }] if has_ada_002 else [],
            ))
        else:
            segments.append((
                SPECULATION_TEMPLATES.get(
                    figure_id,
                    "Speculating upon developments centuries after my death must be recognized as an imaginative exercise. "
                    "Experience and experiment must remain your guiding lights.",
                ),
                "speculation",
                [],
            ))
        return segments

    for idx, chunk in enumerate(chunks[:2]):
        lead = (
            f"In my {chunk.source_title} ({chunk.section or 'Main Text'}), I addressed this directly: "
            if idx == 0
            else f"Furthermore, as documented in {chunk.source_title}, this connects with my broader reasoning: "
        )
        segments.append((f"{lead}'{chunk.text}'", "documented", [_citation(chunk)]))

    if figure_id in INTERPRETATION_TEMPLATES:
        segments.append((INTERPRETATION_TEMPLATES[figure_id], "interpretation", []))

    return segments
