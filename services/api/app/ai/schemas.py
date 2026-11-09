from typing import List, Literal, Optional
from pydantic import BaseModel, Field


class DraftCitation(BaseModel):
    chunk_id: str = Field(description="ID of an evidence-pack chunk, copied exactly, e.g. chunk_ada_001")
    quote_or_excerpt: str = Field(description="Verbatim excerpt copied from that chunk's text")


class DraftSegment(BaseModel):
    text: str = Field(description="One claim or short passage spoken in the figure's first-person voice")
    evidence_status: Literal["documented", "interpretation", "speculation", "unresolved"]
    citations: List[DraftCitation] = Field(default_factory=list)


class DraftAnswer(BaseModel):
    """Structured LLM draft; every citation is re-verified by the GroundingValidator."""

    segments: List[DraftSegment]
    limitation_note: Optional[str] = Field(
        default=None,
        description="Plain-language note on gaps in the evidence or anachronism, if any",
    )
