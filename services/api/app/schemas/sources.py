from typing import Optional, List, Dict, Any, Literal
from pydantic import BaseModel, Field

SourceType = Literal[
    "letter", "speech", "book", "essay", "interview",
    "diary", "official_record", "scholarly_context"
]

SourceQuality = Literal[
    "primary_archive", "verified_transcription", "scholarly_edition", "reference"
]

RightsStatus = Literal[
    "public_domain", "reviewed_open_access", "institutional_permission", "restricted"
]


class HistoricalSource(BaseModel):
    source_id: str
    figure_id: str
    title: str
    author_or_speaker: Optional[str] = None
    source_type: SourceType
    created_date: Optional[str] = None
    publication_date: Optional[str] = None
    language: Optional[str] = "en"
    archive_or_publisher: Optional[str] = None
    canonical_url: Optional[str] = None
    rights_status: RightsStatus = "public_domain"
    source_quality: SourceQuality = "primary_archive"
    transcription_status: Optional[str] = "verified"
    collection_version: int = 1
    metadata: Dict[str, Any] = Field(default_factory=dict)
    summary: Optional[str] = None


class SourceChunk(BaseModel):
    chunk_id: str
    figure_id: str
    source_id: str
    source_title: str
    author_or_speaker: Optional[str] = None
    created_date: Optional[str] = None
    source_type: SourceType
    section: Optional[str] = None
    page_number: Optional[int] = None
    language: str = "en"
    is_primary_source: bool = True
    rights_status: str = "reviewed"
    transcription_status: str = "verified"
    collection_version: int = 1
    text: str
    token_count: Optional[int] = None


class SourceListResponse(BaseModel):
    figure_id: str
    sources: List[HistoricalSource]
    total: int


class ChunkContextResponse(BaseModel):
    chunk: SourceChunk
    source: HistoricalSource
    surrounding_text: Optional[str] = None
