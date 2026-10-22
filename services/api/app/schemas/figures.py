from typing import Optional, List
from pydantic import BaseModel, Field


class HistoricalFigure(BaseModel):
    figure_id: str
    display_name: str
    birth_year: Optional[int] = None
    death_year: Optional[int] = None
    region_or_context: Optional[str] = None
    short_biography: str
    persona_summary: str
    known_voice_traits: List[str] = Field(default_factory=list)
    collection_scope: str
    known_gaps: List[str] = Field(default_factory=list)
    profile_version: int = 1
    avatar_url: Optional[str] = None
    starter_prompts: List[str] = Field(default_factory=list)


class FigureSummary(BaseModel):
    figure_id: str
    display_name: str
    lifespan: str
    region_or_context: Optional[str] = None
    short_biography: str
    primary_sources_count: int
    total_chunks_count: int
    collection_scope: str
    avatar_url: Optional[str] = None


class FigureListResponse(BaseModel):
    figures: List[FigureSummary]
    total: int
