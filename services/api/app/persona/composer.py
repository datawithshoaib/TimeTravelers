from typing import Optional, Sequence

from langchain_core.messages import BaseMessage

from ..ai.graph import is_modern_hypothetical, run_conversation_graph
from ..schemas.answers import HistoricalAnswer


class PersonaComposer:
    """
    Entry point for composing a grounded persona answer.
    Delegates to the LangGraph turn workflow in `app.ai.graph`.
    """

    def is_modern_hypothetical(self, query: str) -> bool:
        return is_modern_hypothetical(query)

    def compose_response(
        self,
        figure_id: str,
        query: str,
        conversation_id: str,
        message_id: Optional[str] = None,
        history: Optional[Sequence[BaseMessage]] = None,
    ) -> HistoricalAnswer:
        return run_conversation_graph(
            figure_id=figure_id,
            query=query,
            conversation_id=conversation_id,
            message_id=message_id,
            history=history,
        )


persona_composer = PersonaComposer()
