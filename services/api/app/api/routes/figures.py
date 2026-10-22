from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

from ...schemas.figures import HistoricalFigure, FigureSummary, FigureListResponse
from ...schemas.sources import SourceListResponse
from ...figures.catalog import get_all_figures, get_figure_by_id
from ...sources.catalog import get_sources_for_figure, get_chunks_for_figure
from ...database import get_db

router = APIRouter(prefix="/api/v1/figures", tags=["Figures"])


@router.get("", response_model=FigureListResponse)
def list_figures():
    """
    List all active historical figures along with source coverage metrics and scopes.
    """
    figures = get_all_figures()
    summaries: List[FigureSummary] = []

    for f in figures:
        sources = get_sources_for_figure(f.figure_id)
        chunks = get_chunks_for_figure(f.figure_id)
        lifespan = f"{f.birth_year or ''} – {f.death_year or 'CE'}"

        summaries.append(
            FigureSummary(
                figure_id=f.figure_id,
                display_name=f.display_name,
                lifespan=lifespan,
                region_or_context=f.region_or_context,
                short_biography=f.short_biography,
                primary_sources_count=len(sources),
                total_chunks_count=len(chunks),
                collection_scope=f.collection_scope,
                avatar_url=f.avatar_url
            )
        )

    return FigureListResponse(figures=summaries, total=len(summaries))


@router.get("/{figure_id}", response_model=HistoricalFigure)
def get_figure_profile(figure_id: str):
    """
    Get full figure profile, communication voice traits, collection scope, and known gaps.
    """
    figure = get_figure_by_id(figure_id)
    if not figure:
        raise HTTPException(status_code=404, detail=f"Figure '{figure_id}' not found.")
    return figure


@router.get("/{figure_id}/sources", response_model=SourceListResponse)
def get_figure_sources(figure_id: str):
    """
    Browse the approved primary and secondary source catalog for a figure.
    """
    figure = get_figure_by_id(figure_id)
    if not figure:
        raise HTTPException(status_code=404, detail=f"Figure '{figure_id}' not found.")

    sources = get_sources_for_figure(figure_id)
    return SourceListResponse(
        figure_id=figure_id,
        sources=sources,
        total=len(sources)
    )
