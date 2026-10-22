import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from ...schemas.feedback import FeedbackCreate, FeedbackResponse
from ...database import get_db, FeedbackModel

router = APIRouter(prefix="/api/v1/feedback", tags=["Feedback"])


@router.post("", response_model=FeedbackResponse)
def submit_feedback(payload: FeedbackCreate, db: Session = Depends(get_db)):
    """
    Submit feedback on inaccurate claims, broken citations, or misattributed quotes.
    """
    feedback_id = f"fb_{uuid.uuid4().hex[:12]}"
    now = datetime.now(timezone.utc)

    fb_record = FeedbackModel(
        feedback_id=feedback_id,
        message_id=payload.message_id,
        conversation_id=payload.conversation_id,
        figure_id=payload.figure_id,
        source_id=payload.source_id,
        chunk_id=payload.chunk_id,
        feedback_type=payload.feedback_type,
        comment=payload.comment,
        user_id=payload.user_id or "default_user",
        created_at=now
    )
    db.add(fb_record)
    db.commit()

    return FeedbackResponse(
        feedback_id=feedback_id,
        message_id=payload.message_id,
        status="received",
        created_at=now.isoformat(),
        message="Thank you for contributing to historical accuracy. Your feedback has been queued for curator review."
    )
