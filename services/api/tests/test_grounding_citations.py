import pytest
from services.api.app.grounding.validator import grounding_validator
from services.api.app.sources.catalog import get_chunks_for_figure
from services.api.app.persona.composer import persona_composer


def test_fabricated_citation_id_rejection():
    """
    CRITICAL TEST (Section 9 & 13):
    Fabricated source or chunk IDs MUST be rejected.
    """
    retrieved_chunks = get_chunks_for_figure("ada_lovelace")
    fake_citations = [
        {"chunk_id": "chunk_fake_9999", "quote_or_excerpt": "Fabricated quote"}
    ]

    valid = grounding_validator.validate_citations(
        candidate_citations=fake_citations,
        retrieved_chunks=retrieved_chunks,
        figure_id="ada_lovelace"
    )
    # The fake citation must be completely stripped out
    assert len(valid) == 0


def test_cross_figure_citation_rejection():
    """
    CRITICAL TEST (Section 9 & 13):
    A citation from another figure's collection passed into this figure's validation MUST be rejected.
    """
    ada_chunks = get_chunks_for_figure("ada_lovelace")
    # Attempt to validate a Galileo chunk under Ada Lovelace
    cross_citations = [
        {"chunk_id": "chunk_galileo_001", "quote_or_excerpt": "Surface of the moon"}
    ]

    valid = grounding_validator.validate_citations(
        candidate_citations=cross_citations,
        retrieved_chunks=ada_chunks,
        figure_id="ada_lovelace"
    )
    assert len(valid) == 0


def test_modern_hypothetical_speculation_label():
    """
    CRITICAL TEST (Section 8 & 13):
    Asking Ada Lovelace 'What would you think of today's AI?' MUST receive a
    speculation label or mixed status with clear historical limitation note.
    """
    answer = persona_composer.compose_response(
        figure_id="ada_lovelace",
        query="What would you think of today's artificial intelligence and neural networks?",
        conversation_id="conv_test_speculation"
    )

    assert answer.overall_status in ["mixed", "speculative"]
    assert answer.limitation_note is not None
    assert "speculative" in answer.limitation_note.lower() or "lifetime" in answer.limitation_note.lower()

    # Verify at least one segment is marked as 'speculation'
    segment_statuses = [s.evidence_status for s in answer.segments]
    assert "speculation" in segment_statuses


def test_well_documented_question_grounded():
    """
    CRITICAL TEST (Section 9 & 13):
    A factual question about the Jacquard loom must return documented segments with real citations.
    """
    answer = persona_composer.compose_response(
        figure_id="ada_lovelace",
        query="Explain how the Analytical Engine weaves algebraical patterns like the Jacquard loom",
        conversation_id="conv_test_documented"
    )

    assert answer.overall_status in ["grounded", "mixed"]
    assert len(answer.segments) > 0

    documented_segments = [s for s in answer.segments if s.evidence_status == "documented"]
    assert len(documented_segments) > 0

    # Every documented segment must have verified citations
    for seg in documented_segments:
        assert len(seg.citations) > 0
        cit = seg.citations[0]
        assert cit.source_id.startswith("source_ada")
        assert cit.chunk_id.startswith("chunk_ada")
        assert "Jacquard-loom" in cit.quote_or_excerpt or "Analytical Engine" in cit.quote_or_excerpt
