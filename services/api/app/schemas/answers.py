from typing import Optional, List, Literal
from pydantic import BaseModel, Field


class ClaimCitation(BaseModel):
    source_id: str
    chunk_id: str
    quote_or_excerpt: str
    source_url: Optional[str] = None
    page_or_section: Optional[str] = None
    source_title: Optional[str] = None
    author: Optional[str] = None
    created_date: Optional[str] = None
    is_primary_source: bool = True
    rights_status: Optional[str] = None
    archive_name: Optional[str] = None


class AnswerSegment(BaseModel):
    text: str
    evidence_status: Literal[
        "documented", "interpretation", "speculation", "unresolved"
    ]
    citations: List[ClaimCitation] = Field(default_factory=list)


class HistoricalAnswer(BaseModel):
    message_id: str
    conversation_id: str
    figure_id: str
    segments: List[AnswerSegment]
    overall_status: Literal[
        "grounded", "mixed", "speculative", "insufficient_evidence"
    ]
    limitation_note: Optional[str] = None
    retrieved_chunk_count: int = 0
    created_at: str
