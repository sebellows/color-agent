"""Main FastAPI application module."""

if __name__ == "__main__":
    import uvicorn

    from api.core.setup import app

    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
