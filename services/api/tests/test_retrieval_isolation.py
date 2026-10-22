import pytest
from services.api.app.retrieval.engine import retrieval_engine


def test_retrieval_strict_figure_isolation():
    """
    CRITICAL TEST (Section 6 & 13):
    Retrieval must be strictly scoped to the requested figure_id.
    Querying Ada Lovelace for 'telescope Jupiter Moon' must NOT return Galileo's chunks.
    Querying Galileo Galilei for 'Analytical Engine Jacquard loom' must NOT return Ada's chunks.
    """
    # 1. Ask Ada Lovelace something related to Galileo's astronomy
    ada_results = retrieval_engine.retrieve(
        figure_id="ada_lovelace",
        query="telescope and the four moons of Jupiter orbiting",
        top_k=5
    )
    # Check that absolutely NO chunk from galileo or other figures is returned
    for chunk, score in ada_results:
        assert chunk.figure_id == "ada_lovelace", f"Security violation: received chunk for {chunk.figure_id}"

    # 2. Ask Galileo something related to Ada's computing engine
    galileo_results = retrieval_engine.retrieve(
        figure_id="galileo_galilei",
        query="Analytical Engine Jacquard-loom weaving algebraical patterns",
        top_k=5
    )
    for chunk, score in galileo_results:
        assert chunk.figure_id == "galileo_galilei", f"Security violation: received chunk for {chunk.figure_id}"

    # 3. Ask Marcus Aurelius for Stoic inner citadel retreat
    marcus_results = retrieval_engine.retrieve(
        figure_id="marcus_aurelius",
        query="inner citadel retreat in the mind",
        top_k=3
    )
    assert len(marcus_results) > 0
    top_chunk, score = marcus_results[0]
    assert top_chunk.figure_id == "marcus_aurelius"
    assert "inner citadel" in top_chunk.text.lower()
