from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

from app.models.database import init_db
from app.api.routes import router

app = FastAPI(
    title="Climate Monitoring & Mapping System",
    version="1.0.0",
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
    return FileResponse("/home/climate-monitoring-system/frontend/dist/index.html")

@app.get("/health")
def health_check():
    return {"status": "healthy"}

frontend_dist = "/home/climate-monitoring-system/frontend/dist"
if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=f"{frontend_dist}/assets"), name="assets")

@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    file_path = os.path.join(frontend_dist, full_path)
    if os.path.isfile(file_path):
        return FileResponse(file_path)
    return FileResponse(os.path.join(frontend_dist, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main_standalone:app", host="0.0.0.0", port=8000, reload=True)
