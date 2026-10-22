from typing import Optional, List, Dict, Any, Literal
from pydantic import BaseModel, Field


class IngestionJob(BaseModel):
    job_id: str
    source_id: str
    figure_id: str
    status: Literal["pending", "processing", "completed", "failed"]
    attempt_count: int = 1
    chunks_indexed: int = 0
    error_code: Optional[str] = None
    error_message: Optional[str] = None
    start_time: str
    end_time: Optional[str] = None


class IngestionJobsResponse(BaseModel):
    jobs: List[IngestionJob]
    total: int


class ReindexRequest(BaseModel):
    force_ocr: bool = False
    rechunk: bool = False


class ReindexResponse(BaseModel):
    job_id: str
    source_id: str
    status: str
    message: str
