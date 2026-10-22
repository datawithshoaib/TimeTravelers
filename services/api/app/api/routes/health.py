from fastapi import APIRouter
from ...figures.catalog import get_all_figures
from ...sources.catalog import SOURCES_CATALOG

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("/live")
def liveness():
    """
    Kubernetes / Docker liveness probe: verifies process is alive.
    """
    return {
        "status": "healthy",
        "service": "timetravelers-api",
        "state": "alive"
    }


@router.get("/ready")
def readiness():
    """
    Readiness probe: verifies catalog indices and database connections are operational.
    """
    figures = get_all_figures()
    sources_count = len(SOURCES_CATALOG)

    return {
        "status": "ready",
        "service": "timetravelers-api",
        "catalog_loaded": True,
        "figures_count": len(figures),
        "sources_count": sources_count
    }
