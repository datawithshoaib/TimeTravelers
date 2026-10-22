import json
from datetime import datetime, timezone
from typing import Generator
from sqlalchemy import (
    create_engine, Column, String, Integer, Boolean, Text, DateTime, ForeignKey, Index
)
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from .config import settings

def utc_now():
    return datetime.now(timezone.utc)

# Engine setup
connect_args = {"check_same_thread": False} if settings.database_url.startswith("sqlite") else {}
engine = create_engine(settings.database_url, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


class FigureModel(Base):
    __tablename__ = "figures"

    figure_id = Column(String(64), primary_key=True)
    display_name = Column(String(255), nullable=False)
    birth_year = Column(Integer, nullable=True)
    death_year = Column(Integer, nullable=True)
    region_or_context = Column(String(255), nullable=True)
    short_biography = Column(Text, nullable=False)
    persona_summary = Column(Text, nullable=False)
    known_voice_traits_json = Column(Text, default="[]")
    collection_scope = Column(Text, nullable=False)
    known_gaps_json = Column(Text, default="[]")
    profile_version = Column(Integer, default=1)
    avatar_url = Column(String(512), nullable=True)
    starter_prompts_json = Column(Text, default="[]")


class SourceModel(Base):
    __tablename__ = "sources"

    source_id = Column(String(64), primary_key=True)
    figure_id = Column(String(64), ForeignKey("figures.figure_id"), nullable=False, index=True)
    title = Column(String(512), nullable=False)
    author_or_speaker = Column(String(255), nullable=True)
    source_type = Column(String(64), nullable=False)
    created_date = Column(String(64), nullable=True)
    publication_date = Column(String(64), nullable=True)
    language = Column(String(16), default="en")
    archive_or_publisher = Column(String(512), nullable=True)
    canonical_url = Column(String(1024), nullable=True)
    rights_status = Column(String(64), default="public_domain")
    source_quality = Column(String(64), default="primary_archive")
    transcription_status = Column(String(64), default="verified")
    collection_version = Column(Integer, default=1)
    metadata_json = Column(Text, default="{}")
    summary = Column(Text, nullable=True)


class SourceChunkModel(Base):
    __tablename__ = "source_chunks"

    chunk_id = Column(String(64), primary_key=True)
    figure_id = Column(String(64), ForeignKey("figures.figure_id"), nullable=False, index=True)
    source_id = Column(String(64), ForeignKey("sources.source_id"), nullable=False, index=True)
    source_title = Column(String(512), nullable=False)
    author_or_speaker = Column(String(255), nullable=True)
    created_date = Column(String(64), nullable=True)
    source_type = Column(String(64), nullable=False)
    section = Column(String(255), nullable=True)
    page_number = Column(Integer, nullable=True)
    language = Column(String(16), default="en")
    is_primary_source = Column(Boolean, default=True)
    rights_status = Column(String(64), default="reviewed")
    transcription_status = Column(String(64), default="verified")
    collection_version = Column(Integer, default=1)
    text = Column(Text, nullable=False)

    __table_args__ = (
        Index("idx_figure_chunk", "figure_id", "chunk_id"),
    )


class ConversationModel(Base):
    __tablename__ = "conversations"

    conversation_id = Column(String(64), primary_key=True)
    figure_id = Column(String(64), ForeignKey("figures.figure_id"), nullable=False, index=True)
    user_id = Column(String(64), default="default_user", index=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)
    settings_json = Column(Text, default="{}")


class MessageModel(Base):
    __tablename__ = "messages"

    message_id = Column(String(64), primary_key=True)
    conversation_id = Column(String(64), ForeignKey("conversations.conversation_id"), nullable=False, index=True)
    role = Column(String(16), nullable=False)  # "user" or "assistant"
    content = Column(Text, nullable=False)
    answer_payload_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)


class FeedbackModel(Base):
    __tablename__ = "feedback"

    feedback_id = Column(String(64), primary_key=True)
    message_id = Column(String(64), nullable=False, index=True)
    conversation_id = Column(String(64), nullable=True)
    figure_id = Column(String(64), nullable=True)
    source_id = Column(String(64), nullable=True)
    chunk_id = Column(String(64), nullable=True)
    feedback_type = Column(String(64), nullable=False)
    comment = Column(Text, nullable=False)
    user_id = Column(String(64), default="default_user")
    created_at = Column(DateTime, default=utc_now)


class IngestionJobModel(Base):
    __tablename__ = "ingestion_jobs"

    job_id = Column(String(64), primary_key=True)
    source_id = Column(String(64), nullable=False)
    figure_id = Column(String(64), nullable=False)
    status = Column(String(32), default="completed")
    attempt_count = Column(Integer, default=1)
    chunks_indexed = Column(Integer, default=0)
    error_code = Column(String(64), nullable=True)
    error_message = Column(Text, nullable=True)
    start_time = Column(DateTime, default=utc_now)
    end_time = Column(DateTime, nullable=True)


def init_db():
    Base.metadata.create_all(bind=engine)


# Auto-create tables on import
init_db()


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
