from fastapi import FastAPI
from .api import router as api_router

app = FastAPI(title="Urban Mobility and Air Quality Analytics API")
app.include_router(api_router)


@app.get("/health", tags=["system"])
async def health_check():
    return {"status": "ok"}


@app.get("/cities", tags=["cities"])
async def list_cities():
    # Placeholder implementation; will be backed by Postgres/PostGIS later
    return [
        {"id": 1, "name": "Kathmandu"},
        {"id": 2, "name": "Lalitpur"},
        {"id": 3, "name": "Bhaktapur"},
    ]