import math
import re
from typing import List, Tuple, Optional
from rapidfuzz import fuzz
from ..schemas.sources import SourceChunk
from ..sources.catalog import get_chunks_for_figure


def tokenize(text: str) -> List[str]:
    return [w.lower() for w in re.findall(r"\b\w{3,}\b", text)]


class FigureRetrievalEngine:
    """
    Per-figure isolated hybrid retrieval engine enforcing server-side collection boundary.
    Combines keyword BM25-style term frequency, token overlap, fuzzy partial matching,
    and source-quality weighting (preferring verified primary sources).
    """

    def __init__(self):
        pass

    def retrieve(
        self,
        figure_id: str,
        query: str,
        top_k: int = 4,
        min_relevance_threshold: float = 18.0
    ) -> List[Tuple[SourceChunk, float]]:
        """
        Retrieves evidence chunks strictly scoped to `figure_id`.
        Cross-figure chunks are strictly filtered out at the collection boundary.
        """
        candidate_chunks = get_chunks_for_figure(figure_id)
        if not candidate_chunks:
            return []

        query_clean = query.strip()
        query_tokens = set(tokenize(query_clean))
        if not query_tokens:
            return []

        scored_chunks: List[Tuple[SourceChunk, float]] = []

        for chunk in candidate_chunks:
            chunk_text = chunk.text
            chunk_tokens = set(tokenize(chunk_text))

            # 1. Token overlap (Jaccard / dice ratio)
            overlap = len(query_tokens.intersection(chunk_tokens))
            token_score = (overlap / max(1, len(query_tokens))) * 40.0

            # 2. Fuzzy similarity (RapidFuzz partial token set ratio)
            fuzzy_ratio = fuzz.token_set_ratio(query_clean, chunk_text)
            fuzzy_score = (fuzzy_ratio / 100.0) * 35.0

            # 3. Exact phrase match boost
            phrase_boost = 0.0
            for token in query_tokens:
                if token in chunk_text.lower():
                    phrase_boost += 4.0
            phrase_boost = min(phrase_boost, 20.0)

            # 4. Source quality weighting (prefer primary sources per Section 6)
            quality_weight = 1.25 if chunk.is_primary_source else 1.0

            # 5. Section/Title relevance boost
            header_boost = 0.0
            if chunk.section and any(t in chunk.section.lower() for t in query_tokens):
                header_boost += 8.0
            if any(t in chunk.source_title.lower() for t in query_tokens):
                header_boost += 5.0

            total_score = (token_score + fuzzy_score + phrase_boost + header_boost) * quality_weight

            if total_score >= min_relevance_threshold:
                scored_chunks.append((chunk, round(total_score, 2)))

        # Sort descending by relevance score
        scored_chunks.sort(key=lambda x: x[1], reverse=True)
        return scored_chunks[:top_k]


retrieval_engine = FigureRetrievalEngine()
