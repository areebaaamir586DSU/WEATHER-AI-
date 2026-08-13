#!/usr/bin/env python3
"""
Climate Monitoring & Mapping System - Standalone Server
Serves both backend API and frontend on a single port (8000)
"""
import uvicorn
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend"))

from app.main_standalone import app

if __name__ == "__main__":
    print("=" * 50)
    print("Climate Monitoring & Mapping System")
    print("=" * 50)
    print()
    print("Starting server on http://0.0.0.0:8000")
    print()
    print("Access URLs:")
    print("  Local:    http://localhost:8000")
    print("  Network:  http://0.0.0.0:8000")
    print()
    print("Press Ctrl+C to stop")
    print("=" * 50)
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
