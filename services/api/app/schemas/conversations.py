from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from .answers import HistoricalAnswer


class ConversationCreate(BaseModel):
    figure_id: str
    user_id: Optional[str] = "default_user"
    settings: Dict[str, Any] = Field(default_factory=dict)


class ConversationResponse(BaseModel):
    conversation_id: str
    figure_id: str
    user_id: str
    created_at: str
    updated_at: str
    message_count: int = 0
    settings: Dict[str, Any] = Field(default_factory=dict)


class MessageCreate(BaseModel):
    message: str
    user_id: Optional[str] = "default_user"


class MessageRecord(BaseModel):
    message_id: str
    conversation_id: str
    role: str  # "user" or "assistant"
    content: str
    answer_payload: Optional[HistoricalAnswer] = None
    created_at: str


class ConversationDetailResponse(BaseModel):
    conversation: ConversationResponse
    messages: List[MessageRecord]
