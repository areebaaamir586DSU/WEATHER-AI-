from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.models.database import init_db
from app.api.routes import router

app = FastAPI(
    title="Climate Monitoring & Mapping System",
    description="A digital system for monitoring and visualizing climate-related information through dashboards and map-based interfaces.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api/v1")


@app.on_event("startup")
def startup_event():
    init_db()


@app.get("/")
def root():
    return {
        "name": "Climate Monitoring & Mapping System",
        "version": "1.0.0",
        "docs": "/docs",
        "api": "/api/v1",
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
