export type SourceType =
  | 'letter'
  | 'speech'
  | 'book'
  | 'essay'
  | 'interview'
  | 'diary'
  | 'official_record'
  | 'scholarly_context';

export type EvidenceStatus = 'documented' | 'interpretation' | 'speculation' | 'unresolved';

export type OverallStatus = 'grounded' | 'mixed' | 'speculative' | 'insufficient_evidence';

export interface HistoricalFigure {
  figure_id: string;
  display_name: string;
  birth_year: number | null;
  death_year: number | null;
  region_or_context: string | null;
  short_biography: string;
  persona_summary: string;
  known_voice_traits: string[];
  collection_scope: string;
  known_gaps: string[];
  profile_version: number;
  avatar_url?: string | null;
  starter_prompts: string[];
}

export interface FigureSummary {
  figure_id: string;
  display_name: string;
  lifespan: string;
  region_or_context: string | null;
  short_biography: string;
  primary_sources_count: number;
  total_chunks_count: number;
  collection_scope: string;
  avatar_url?: string | null;
}

export interface HistoricalSource {
  source_id: string;
  figure_id: string;
  title: string;
  author_or_speaker?: string | null;
  source_type: SourceType;
  created_date?: string | null;
  publication_date?: string | null;
  language?: string | null;
  archive_or_publisher?: string | null;
  canonical_url?: string | null;
  rights_status: string;
  source_quality: string;
  transcription_status?: string | null;
  collection_version: number;
  summary?: string | null;
}

export interface SourceChunk {
  chunk_id: string;
  figure_id: string;
  source_id: string;
  source_title: string;
  author_or_speaker?: string | null;
  created_date?: string | null;
  source_type: SourceType;
  section?: string | null;
  page_number?: number | null;
  language: string;
  is_primary_source: boolean;
  rights_status: string;
  transcription_status: string;
  collection_version: number;
  text: string;
}

export interface ClaimCitation {
  source_id: string;
  chunk_id: string;
  quote_or_excerpt: string;
  source_url?: string | null;
  page_or_section?: string | null;
  source_title?: string | null;
  author?: string | null;
  created_date?: string | null;
  is_primary_source: boolean;
  rights_status?: string | null;
  archive_name?: string | null;
}

export interface AnswerSegment {
  text: string;
  evidence_status: EvidenceStatus;
  citations: ClaimCitation[];
}

export interface HistoricalAnswer {
  message_id: string;
  conversation_id: string;
  figure_id: string;
  segments: AnswerSegment[];
  overall_status: OverallStatus;
  limitation_note?: string | null;
  retrieved_chunk_count: number;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  answerPayload?: HistoricalAnswer;
}

export type FeedbackType =
  | 'inaccurate_claim'
  | 'broken_citation'
  | 'misattributed_quote'
  | 'anachronism'
  | 'general';
