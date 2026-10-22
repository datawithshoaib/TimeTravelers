-- TimeTravelers Database Schema (PostgreSQL / SQLite Compatible DDL)
-- Version: 1.0.0

CREATE TABLE IF NOT EXISTS figures (
    figure_id VARCHAR(64) PRIMARY KEY,
    display_name VARCHAR(255) NOT NULL,
    birth_year INTEGER,
    death_year INTEGER,
    region_or_context VARCHAR(255),
    short_biography TEXT NOT NULL,
    persona_summary TEXT NOT NULL,
    known_voice_traits_json TEXT DEFAULT '[]',
    collection_scope TEXT NOT NULL,
    known_gaps_json TEXT DEFAULT '[]',
    profile_version INTEGER DEFAULT 1,
    avatar_url VARCHAR(512),
    starter_prompts_json TEXT DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS sources (
    source_id VARCHAR(64) PRIMARY KEY,
    figure_id VARCHAR(64) NOT NULL REFERENCES figures(figure_id),
    title VARCHAR(512) NOT NULL,
    author_or_speaker VARCHAR(255),
    source_type VARCHAR(64) NOT NULL,
    created_date VARCHAR(64),
    publication_date VARCHAR(64),
    language VARCHAR(16) DEFAULT 'en',
    archive_or_publisher VARCHAR(512),
    canonical_url VARCHAR(1024),
    rights_status VARCHAR(64) DEFAULT 'public_domain',
    source_quality VARCHAR(64) DEFAULT 'primary_archive',
    transcription_status VARCHAR(64) DEFAULT 'verified',
    collection_version INTEGER DEFAULT 1,
    metadata_json TEXT DEFAULT '{}',
    summary TEXT
);

CREATE INDEX IF NOT EXISTS idx_sources_figure ON sources(figure_id);

CREATE TABLE IF NOT EXISTS source_chunks (
    chunk_id VARCHAR(64) PRIMARY KEY,
    figure_id VARCHAR(64) NOT NULL REFERENCES figures(figure_id),
    source_id VARCHAR(64) NOT NULL REFERENCES sources(source_id),
    source_title VARCHAR(512) NOT NULL,
    author_or_speaker VARCHAR(255),
    created_date VARCHAR(64),
    source_type VARCHAR(64) NOT NULL,
    section VARCHAR(255),
    page_number INTEGER,
    language VARCHAR(16) DEFAULT 'en',
    is_primary_source BOOLEAN DEFAULT TRUE,
    rights_status VARCHAR(64) DEFAULT 'reviewed',
    transcription_status VARCHAR(64) DEFAULT 'verified',
    collection_version INTEGER DEFAULT 1,
    text TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_chunks_figure_chunk ON source_chunks(figure_id, chunk_id);

CREATE TABLE IF NOT EXISTS conversations (
    conversation_id VARCHAR(64) PRIMARY KEY,
    figure_id VARCHAR(64) NOT NULL REFERENCES figures(figure_id),
    user_id VARCHAR(64) DEFAULT 'default_user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    settings_json TEXT DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id);

CREATE TABLE IF NOT EXISTS messages (
    message_id VARCHAR(64) PRIMARY KEY,
    conversation_id VARCHAR(64) NOT NULL REFERENCES conversations(conversation_id),
    role VARCHAR(16) NOT NULL,
    content TEXT NOT NULL,
    answer_payload_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages(conversation_id);

CREATE TABLE IF NOT EXISTS feedback (
    feedback_id VARCHAR(64) PRIMARY KEY,
    message_id VARCHAR(64) NOT NULL,
    conversation_id VARCHAR(64),
    figure_id VARCHAR(64),
    source_id VARCHAR(64),
    chunk_id VARCHAR(64),
    feedback_type VARCHAR(64) NOT NULL,
    comment TEXT NOT NULL,
    user_id VARCHAR(64) DEFAULT 'default_user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ingestion_jobs (
    job_id VARCHAR(64) PRIMARY KEY,
    source_id VARCHAR(64) NOT NULL,
    figure_id VARCHAR(64) NOT NULL,
    status VARCHAR(32) DEFAULT 'completed',
    attempt_count INTEGER DEFAULT 1,
    chunks_indexed INTEGER DEFAULT 0,
    error_code VARCHAR(64),
    error_message TEXT,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP
);
