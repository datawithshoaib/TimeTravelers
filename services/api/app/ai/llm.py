import logging
from functools import lru_cache
from typing import Optional

from langchain_anthropic import ChatAnthropic
from langchain_core.runnables import Runnable

from ..config import settings
from .schemas import DraftAnswer

logger = logging.getLogger("timetravelers.ai")


def llm_enabled() -> bool:
    if settings.llm_mode == "offline":
        return False
    if settings.llm_mode == "anthropic":
        return True
    return bool(settings.anthropic_api_key)


@lru_cache(maxsize=1)
def get_drafting_model() -> Optional[Runnable]:
    """
    Claude chat model constrained to the DraftAnswer schema.

    Uses `method="json_schema"` (output_config.format) rather than forced tool
    calling, which Claude Opus 5.5 rejects. Server-side fallbacks re-run the
    request on another model if the primary one declines.
    """
    if not llm_enabled():
        return None

    model = ChatAnthropic(
        model=settings.llm_model,
        api_key=settings.anthropic_api_key or None,
        max_tokens=settings.llm_max_tokens,
        effort=settings.llm_effort,
        betas=["server-side-fallback-2026-07-01"],
        model_kwargs={"fallbacks": "default"},
        max_retries=2,
    )
    logger.info("LLM drafting enabled with model %s", settings.llm_model)
    return model.with_structured_output(DraftAnswer, method="json_schema")
