#!/bin/bash

echo "🌍 Climate Monitoring & Mapping System"
echo "======================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    exit 1
fi

echo "📦 Setting up backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt -q

# Initialize and seed database
echo "Initializing database..."
python seed_data.py

# Start backend server in background
echo "Starting backend server on port 8000..."
uvicorn app.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

cd ../frontend

echo ""
echo "📦 Setting up frontend..."

# Install dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Starting services..."
echo "   Backend API:  http://localhost:8000"
echo "   API Docs:     http://localhost:8000/docs"
echo "   Frontend:     http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Start frontend
npm run dev

# Cleanup on exit
trap "kill $BACKEND_PID 2>/dev/null; exit" INT TERM
wait
