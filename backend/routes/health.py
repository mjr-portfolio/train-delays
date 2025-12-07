from . import health_bp


@health_bp.get("/api/health")
def health():
    return {"status": "ok"}
