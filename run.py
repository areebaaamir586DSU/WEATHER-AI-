#!/usr/bin/env python3
"""Single-port server for Climate Monitoring System"""
import uvicorn
import sys
import os

backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend")
sys.path.insert(0, backend_dir)

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse

from app.models.database import init_db
from app.api.routes import router

FRONTEND_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "frontend", "dist")

app = FastAPI(title="Climate Monitoring System", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api/v1")

@app.on_event("startup")
def startup():
    init_db()
    print("Database initialized")

@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.get("/")
def index():
    return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))

@app.get("/map")
@app.get("/analytics")
@app.get("/alerts")
@app.get("/stations")
def spa_routes():
    return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))

if os.path.exists(os.path.join(FRONTEND_DIR, "assets")):
    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIR, "assets")), name="static-assets")

if __name__ == "__main__":
    print("=" * 50)
    print("Climate Monitoring & Mapping System")
    print("=" * 50)
    print("Starting on http://0.0.0.0:8000")
    print("Open http://localhost:8000 in your browser")
    print("=" * 50)
    uvicorn.run(app, host="0.0.0.0", port=8000)
