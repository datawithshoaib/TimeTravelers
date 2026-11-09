import type {
  FeedbackType,
  HistoricalAnswer,
  HistoricalFigure,
  HistoricalSource,
} from "@/lib/types";

// Browser-side client. Paths are relative: next.config rewrites /api/v1 and
// /health to the FastAPI backend, so the app is served from a single origin.

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(res.status, body?.detail ?? `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export function getFigureDetail(figureId: string) {
  return request<HistoricalFigure>(`/api/v1/figures/${figureId}`);
}

export async function getFigureSources(figureId: string) {
  const data = await request<{ sources: HistoricalSource[] }>(`/api/v1/figures/${figureId}/sources`);
  return data.sources;
}

export function sendChatMessage(figureId: string, message: string, conversationId?: string) {
  return request<HistoricalAnswer>("/api/v1/chat", {
    method: "POST",
    body: JSON.stringify({ figure_id: figureId, message, conversation_id: conversationId }),
  });
}

export function sendFeedback(payload: {
  message_id: string;
  conversation_id?: string;
  figure_id?: string;
  source_id?: string;
  chunk_id?: string;
  feedback_type: FeedbackType;
  comment: string;
}) {
  return request<{ status: string; message: string }>("/api/v1/feedback", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
