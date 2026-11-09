import json
import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

from langchain_core.messages import AIMessage, BaseMessage, HumanMessage

from ...schemas.conversations import (
    ConversationCreate,
    ConversationResponse,
    MessageCreate,
    MessageRecord,
    ConversationDetailResponse
)
from ...schemas.answers import HistoricalAnswer
from ...database import (
    get_db,
    ConversationModel,
    MessageModel
)
from ...figures.catalog import get_figure_by_id
from ...persona.composer import persona_composer
from ...config import settings

router = APIRouter(prefix="/api/v1", tags=["Conversations"])


def load_recent_history(db: Session, conversation_id: str) -> List[BaseMessage]:
    """Most recent turns of a conversation as LangChain messages, oldest first."""
    rows = (
        db.query(MessageModel)
        .filter(MessageModel.conversation_id == conversation_id)
        .order_by(MessageModel.created_at.desc())
        .limit(settings.history_turns * 2)
        .all()
    )
    return [
        HumanMessage(content=m.content) if m.role == "user" else AIMessage(content=m.content)
        for m in reversed(rows)
    ]


@router.post("/conversations", response_model=ConversationResponse)
def create_conversation(payload: ConversationCreate, db: Session = Depends(get_db)):
    """
    Start a figure conversation. Validates figure ID and initializes context.
    """
    figure = get_figure_by_id(payload.figure_id)
    if not figure:
        raise HTTPException(status_code=404, detail=f"Figure '{payload.figure_id}' does not exist.")

    conversation_id = f"conv_{uuid.uuid4().hex[:12]}"
    now = datetime.now(timezone.utc)

    conv = ConversationModel(
        conversation_id=conversation_id,
        figure_id=payload.figure_id,
        user_id=payload.user_id or "default_user",
        created_at=now,
        updated_at=now,
        settings_json=json.dumps(payload.settings)
    )
    db.add(conv)
    db.commit()

    return ConversationResponse(
        conversation_id=conversation_id,
        figure_id=payload.figure_id,
        user_id=conv.user_id,
        created_at=conv.created_at.isoformat(),
        updated_at=conv.updated_at.isoformat(),
        message_count=0,
        settings=payload.settings
    )


@router.get("/conversations/{conversation_id}", response_model=ConversationDetailResponse)
def get_conversation_history(conversation_id: str, db: Session = Depends(get_db)):
    """
    Load conversation history, user prompts, assistant answers, and cited evidence.
    """
    conv = db.query(ConversationModel).filter(ConversationModel.conversation_id == conversation_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail=f"Conversation '{conversation_id}' not found.")

    messages_db = db.query(MessageModel).filter(MessageModel.conversation_id == conversation_id).order_by(MessageModel.created_at.asc()).all()

    message_records: List[MessageRecord] = []
    for m in messages_db:
        answer_payload = None
        if m.answer_payload_json:
            try:
                answer_dict = json.loads(m.answer_payload_json)
                answer_payload = HistoricalAnswer(**answer_dict)
            except Exception:
                answer_payload = None

        message_records.append(
            MessageRecord(
                message_id=m.message_id,
                conversation_id=m.conversation_id,
                role=m.role,
                content=m.content,
                answer_payload=answer_payload,
                created_at=m.created_at.isoformat()
            )
        )

    settings_dict = {}
    try:
        settings_dict = json.loads(conv.settings_json)
    except Exception:
        pass

    return ConversationDetailResponse(
        conversation=ConversationResponse(
            conversation_id=conv.conversation_id,
            figure_id=conv.figure_id,
            user_id=conv.user_id,
            created_at=conv.created_at.isoformat(),
            updated_at=conv.updated_at.isoformat(),
            message_count=len(message_records),
            settings=settings_dict
        ),
        messages=message_records
    )


@router.post("/conversations/{conversation_id}/messages", response_model=HistoricalAnswer)
def submit_question(
    conversation_id: str,
    payload: MessageCreate,
    db: Session = Depends(get_db)
):
    """
    Submit a question to the historical figure in an existing conversation.
    Retrieves evidence, simulates persona, validates citations, and stores response.
    """
    conv = db.query(ConversationModel).filter(ConversationModel.conversation_id == conversation_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail=f"Conversation '{conversation_id}' not found.")

    history = load_recent_history(db, conversation_id)

    user_msg_id = f"msg_{uuid.uuid4().hex[:12]}"
    user_msg = MessageModel(
        message_id=user_msg_id,
        conversation_id=conversation_id,
        role="user",
        content=payload.message,
        created_at=datetime.now(timezone.utc)
    )
    db.add(user_msg)

    # Compose grounded historical answer
    assistant_msg_id = f"msg_{uuid.uuid4().hex[:12]}"
    answer = persona_composer.compose_response(
        figure_id=conv.figure_id,
        query=payload.message,
        conversation_id=conversation_id,
        message_id=assistant_msg_id,
        history=history
    )

    assistant_msg = MessageModel(
        message_id=assistant_msg_id,
        conversation_id=conversation_id,
        role="assistant",
        content=" ".join([s.text for s in answer.segments]),
        answer_payload_json=answer.model_dump_json(),
        created_at=datetime.now(timezone.utc)
    )
    db.add(assistant_msg)

    conv.updated_at = datetime.now(timezone.utc)
    db.commit()

    return answer


# Convenience endpoint supporting direct chat requests (as illustrated in Section 12)
class DirectChatRequest(MessageCreate):
    figure_id: str
    conversation_id: str | None = None


@router.post("/chat", response_model=HistoricalAnswer)
def direct_chat(payload: DirectChatRequest, db: Session = Depends(get_db)):
    """
    Unified chat endpoint: initializes or joins conversation and submits message in one round-trip.
    """
    figure = get_figure_by_id(payload.figure_id)
    if not figure:
        raise HTTPException(status_code=404, detail=f"Figure '{payload.figure_id}' not found.")

    conv_id = payload.conversation_id
    if not conv_id:
        conv_id = f"conv_{uuid.uuid4().hex[:12]}"
        now = datetime.now(timezone.utc)
        conv = ConversationModel(
            conversation_id=conv_id,
            figure_id=payload.figure_id,
            user_id=payload.user_id or "default_user",
            created_at=now,
            updated_at=now,
            settings_json="{}"
        )
        db.add(conv)
        db.commit()
    else:
        conv = db.query(ConversationModel).filter(ConversationModel.conversation_id == conv_id).first()
        if not conv:
            conv = ConversationModel(
                conversation_id=conv_id,
                figure_id=payload.figure_id,
                user_id=payload.user_id or "default_user",
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
                settings_json="{}"
            )
            db.add(conv)
            db.commit()

    return submit_question(
        conversation_id=conv_id,
        payload=MessageCreate(message=payload.message, user_id=payload.user_id),
        db=db
    )
