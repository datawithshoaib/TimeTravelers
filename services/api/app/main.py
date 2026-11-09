import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database import init_db
from .api.routes import figures, conversations, sources, feedback, admin, health

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("timetravelers")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing TimeTravelers database and catalog index...")
    init_db()
    logger.info("TimeTravelers API started successfully.")
    yield
    logger.info("TimeTravelers API shutting down.")


app = FastAPI(
    title="TimeTravelers API",
    version=settings.app_version,
    description="Production-Grade Historical Figure Conversation App grounded in primary sources",
    lifespan=lifespan
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.cors_origins.split(",") if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(figures.router)
app.include_router(conversations.router)
app.include_router(sources.router)
app.include_router(feedback.router)
app.include_router(admin.router)
app.include_router(health.router)


@app.get("/")
def root():
    return {
        "app": "TimeTravelers",
        "description": "Production-Grade Historical Figure Conversation System",
        "version": settings.app_version,
        "docs": "/docs",
        "health": "/health/ready"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("services.api.app.main:app", host="0.0.0.0", port=8000, reload=True)
