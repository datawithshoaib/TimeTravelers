from typing import List

from langchain_core.callbacks import CallbackManagerForRetrieverRun
from langchain_core.documents import Document
from langchain_core.retrievers import BaseRetriever

from ..retrieval.engine import retrieval_engine
from ..schemas.sources import SourceChunk
from ..sources.catalog import get_chunk_by_id


class FigureScopedRetriever(BaseRetriever):
    """
    LangChain retriever bound to a single figure's approved collection.
    The figure_id is fixed at construction time, so a retriever instance can
    never surface another figure's chunks regardless of the query.
    """

    figure_id: str
    top_k: int = 3

    def _get_relevant_documents(
        self, query: str, *, run_manager: CallbackManagerForRetrieverRun
    ) -> List[Document]:
        results = retrieval_engine.retrieve(figure_id=self.figure_id, query=query, top_k=self.top_k)
        return [
            Document(
                page_content=chunk.text,
                metadata={
                    "chunk_id": chunk.chunk_id,
                    "source_id": chunk.source_id,
                    "figure_id": chunk.figure_id,
                    "source_title": chunk.source_title,
                    "section": chunk.section,
                    "score": score,
                },
            )
            for chunk, score in results
        ]


def documents_to_chunks(documents: List[Document]) -> List[SourceChunk]:
    """Resolve retrieved documents back to their canonical catalog chunks."""
    chunks: List[SourceChunk] = []
    for doc in documents:
        chunk = get_chunk_by_id(doc.metadata["chunk_id"])
        if chunk:
            chunks.append(chunk)
    return chunks
