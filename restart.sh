#!/bin/bash
# Kill any existing processes
pkill -9 -f "uvicorn" 2>/dev/null
pkill -9 -f "vite" 2>/dev/null  
pkill -9 -f "node.*vite" 2>/dev/null
sleep 2

echo "Starting Climate Monitoring System..."
cd /home/climate-monitoring-system/backend

# Start backend
nohup python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
sleep 2

# Verify backend
if curl -s http://localhost:8000/ > /dev/null; then
    echo "Backend running on port 8000"
else
    echo "Backend failed to start"
    exit 1
fi

cd /home/climate-monitoring-system/frontend

# Start frontend  
nohup npx vite --host 0.0.0.0 --port 5173 > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
sleep 3

# Verify frontend
if curl -s http://localhost:5173/ > /dev/null; then
    echo "Frontend running on port 5173"
else
    echo "Frontend failed to start"
    exit 1
fi

echo ""
echo "=== SYSTEM RUNNING ==="
echo "Backend API:  http://localhost:8000"
echo "Frontend:     http://localhost:5173"
echo "API Docs:     http://localhost:8000/docs"
echo ""
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
