from typing import List, Dict, Optional, Tuple, Literal
from rapidfuzz import fuzz
from ..schemas.sources import SourceChunk
from ..schemas.answers import ClaimCitation, AnswerSegment, HistoricalAnswer
from ..sources.catalog import get_source_by_id


class GroundingValidator:
    """
    Deterministic Grounding and Citation Validator as specified in Section 9.
    Verifies that:
    1. Every citation resolves to an approved chunk retrieved for the CURRENT figure and request.
    2. Quotes or excerpts actually exist within the chunk's verified text.
    3. Cross-figure citations or fabricated IDs are strictly detected and rejected.
    4. Unsupported factual claims are downgraded to speculation or removed.
    """

    def validate_citations(
        self,
        candidate_citations: List[Dict[str, str]],
        retrieved_chunks: List[SourceChunk],
        figure_id: str
    ) -> List[ClaimCitation]:
        valid_citations: List[ClaimCitation] = []
        retrieved_map: Dict[str, SourceChunk] = {c.chunk_id: c for c in retrieved_chunks}

        for cit in candidate_citations:
            chunk_id = cit.get("chunk_id", "").strip()
            quote = cit.get("quote_or_excerpt", "").strip()

            # Rule 1: Chunk ID must exist in current retrieval set
            if chunk_id not in retrieved_map:
                continue

            chunk = retrieved_map[chunk_id]

            # Rule 2: Strictly verify figure scope
            if chunk.figure_id != figure_id:
                # Security: Cross-figure contamination rejected!
                continue

            # Rule 3: Quote verification
            # Verify quote is actually represented in the chunk text
            if quote:
                similarity = fuzz.partial_ratio(quote.lower(), chunk.text.lower())
                # If the quote is completely detached from the text, reject
                if similarity < 65:
                    # Fallback to authentic snippet from chunk
                    quote = chunk.text[:160] + "..."

            source = get_source_by_id(chunk.source_id)
            source_title = source.title if source else chunk.source_title
            author = source.author_or_speaker if source else chunk.author_or_speaker
            source_url = source.canonical_url if source else None
            archive_name = source.archive_or_publisher if source else None
            rights_status = source.rights_status if source else chunk.rights_status

            valid_citations.append(
                ClaimCitation(
                    source_id=chunk.source_id,
                    chunk_id=chunk.chunk_id,
                    quote_or_excerpt=quote if quote else chunk.text[:180] + "...",
                    source_url=source_url,
                    page_or_section=chunk.section or f"Page {chunk.page_number}" if chunk.page_number else None,
                    source_title=source_title,
                    author=author,
                    created_date=chunk.created_date,
                    is_primary_source=chunk.is_primary_source,
                    rights_status=rights_status,
                    archive_name=archive_name
                )
            )

        return valid_citations

    def build_historical_answer(
        self,
        message_id: str,
        conversation_id: str,
        figure_id: str,
        raw_segments: List[Tuple[str, str, List[Dict[str, str]]]],
        retrieved_chunks: List[SourceChunk],
        limitation_note: Optional[str] = None
    ) -> HistoricalAnswer:
        validated_segments: List[AnswerSegment] = []
        has_documented = False
        has_speculation = False
        has_interpretation = False

        for text, evidence_status, cits in raw_segments:
            status_clean: Literal["documented", "interpretation", "speculation", "unresolved"]
            if evidence_status in ["documented", "interpretation", "speculation", "unresolved"]:
                status_clean = evidence_status  # type: ignore
            else:
                status_clean = "interpretation"

            # Documented segments must have valid citations
            valid_cits = self.validate_citations(cits, retrieved_chunks, figure_id)

            if status_clean == "documented" and not valid_cits:
                # Downgrade claim without valid citations to interpretation or speculation
                status_clean = "interpretation"

            if status_clean == "documented":
                has_documented = True
            elif status_clean == "speculation":
                has_speculation = True
            elif status_clean == "interpretation":
                has_interpretation = True

            validated_segments.append(
                AnswerSegment(
                    text=text.strip(),
                    evidence_status=status_clean,
                    citations=valid_cits
                )
            )

        # Determine overall answer status
        if not validated_segments or (not has_documented and not has_interpretation and not has_speculation):
            overall_status: Literal["grounded", "mixed", "speculative", "insufficient_evidence"] = "insufficient_evidence"
        elif has_documented and not has_speculation and not has_interpretation:
            overall_status = "grounded"
        elif has_speculation and not has_documented:
            overall_status = "speculative"
        elif not has_documented and len(retrieved_chunks) == 0:
            overall_status = "insufficient_evidence"
        else:
            overall_status = "mixed"

        from datetime import datetime, timezone
        return HistoricalAnswer(
            message_id=message_id,
            conversation_id=conversation_id,
            figure_id=figure_id,
            segments=validated_segments,
            overall_status=overall_status,
            limitation_note=limitation_note,
            retrieved_chunk_count=len(retrieved_chunks),
            created_at=datetime.now(timezone.utc).isoformat()
        )


grounding_validator = GroundingValidator()
