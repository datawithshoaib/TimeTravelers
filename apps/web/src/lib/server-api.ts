import "server-only";

import type { FigureSummary } from "@/lib/types";

// Server Components call FastAPI directly rather than through the rewrite.
const API_INTERNAL_URL = process.env.API_INTERNAL_URL ?? "http://localhost:8000";

export async function getFigures(): Promise<FigureSummary[]> {
  try {
    const res = await fetch(`${API_INTERNAL_URL}/api/v1/figures`, {
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return [];
    const data: { figures: FigureSummary[] } = await res.json();
    return data.figures;
  } catch {
    return [];
  }
}
