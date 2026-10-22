from pydantic import ConfigDict
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    model_config = ConfigDict(env_file=".env", extra="ignore")

    app_name: str = "TimeTravelers API"
    app_version: str = "1.0.0"
    debug: bool = False
    database_url: str = "sqlite:///./timetravelers.db"
    vector_store_url: str = ""
    llm_api_key: str = ""
    embedding_api_key: str = ""
    app_base_url: str = "http://localhost:3000"
    api_base_url: str = "http://localhost:8000"
    auth_secret: str = "timetravelers-development-secret-key-32b"
    collection_version: int = 1


settings = Settings()
