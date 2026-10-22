from typing import Optional, Literal
from pydantic import BaseModel


class FeedbackCreate(BaseModel):
    message_id: str
    conversation_id: Optional[str] = None
    figure_id: Optional[str] = None
    source_id: Optional[str] = None
    chunk_id: Optional[str] = None
    feedback_type: Literal[
        "inaccurate_claim",
        "broken_citation",
        "misattributed_quote",
        "anachronism",
        "general"
    ]
    comment: str
    user_id: Optional[str] = "default_user"


class FeedbackResponse(BaseModel):
    feedback_id: str
    message_id: str
    status: str = "received"
    created_at: str
    message: str = "Thank you. Your feedback has been queued for historical review."
