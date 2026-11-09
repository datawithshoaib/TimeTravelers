from typing import Literal

from pydantic import ConfigDict
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    model_config = ConfigDict(env_file=".env", extra="ignore")

    app_name: str = "TimeTravelers API"
    app_version: str = "1.0.0"
    debug: bool = False
    database_url: str = "sqlite:///./timetravelers.db"
    vector_store_url: str = ""
    embedding_api_key: str = ""
    app_base_url: str = "http://localhost:3000"
    api_base_url: str = "http://localhost:8000"
    cors_origins: str = "http://localhost:3000"
    auth_secret: str = "timetravelers-development-secret-key-32b"
    collection_version: int = 1

    # LLM drafting (LangChain + Claude). "auto" uses Claude when ANTHROPIC_API_KEY
    # is set and the deterministic offline drafter otherwise.
    llm_mode: Literal["auto", "anthropic", "offline"] = "auto"
    anthropic_api_key: str = ""
    llm_model: str = "claude-opus-5-5"
    llm_effort: Literal["low", "medium", "high", "xhigh", "max"] = "medium"
    llm_max_tokens: int = 16000
    history_turns: int = 6


settings = Settings()
