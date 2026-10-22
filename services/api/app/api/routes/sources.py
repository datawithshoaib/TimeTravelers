from fastapi import APIRouter, HTTPException
from ...schemas.sources import HistoricalSource, ChunkContextResponse
from ...sources.catalog import get_source_by_id, get_chunk_by_id

router = APIRouter(prefix="/api/v1/sources", tags=["Sources"])


@router.get("/{source_id}", response_model=HistoricalSource)
def get_source_metadata(source_id: str):
    """
    Get full archival metadata, rights status, edition, and transcription quality for a source.
    """
    source = get_source_by_id(source_id)
    if not source:
        raise HTTPException(status_code=404, detail=f"Source '{source_id}' not found.")
    return source


@router.get("/{source_id}/chunks/{chunk_id}", response_model=ChunkContextResponse)
def get_chunk_context(source_id: str, chunk_id: str):
    """
    Get specific excerpt, page/section boundaries, rights status, and surrounding context.
    """
    source = get_source_by_id(source_id)
    if not source:
        raise HTTPException(status_code=404, detail=f"Source '{source_id}' not found.")

    chunk = get_chunk_by_id(chunk_id)
    if not chunk or chunk.source_id != source_id:
        raise HTTPException(
            status_code=404,
            detail=f"Chunk '{chunk_id}' not found for source '{source_id}'."
        )

    surrounding = (
        f"[Archival context: {source.title}, {chunk.section or 'Section'} - {source.archive_or_publisher or 'Primary Archive'}]\n\n"
        f"\"{chunk.text}\"\n\n"
        f"[Provenance: Transcription verified in collection v{chunk.collection_version}. Rights: {chunk.rights_status}]"
    )

    return ChunkContextResponse(
        chunk=chunk,
        source=source,
        surrounding_text=surrounding
    )
