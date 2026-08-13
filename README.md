# 🌍 Climate Monitoring & Mapping System

A full-stack digital system for monitoring and visualizing climate-related information through interactive dashboards and map-based interfaces.

## Features

### 🗺️ Interactive Map
- Real-time climate data visualization on a global map
- Multiple overlay layers: Temperature, Humidity, AQI, Wind, Precipitation
- Click-on-station details with live readings
- Color-coded markers based on readings

### 📊 Dashboard
- Live statistics overview with key metrics
- Recent station readings grid
- Active alerts summary
- Quick access to detailed views

### 📈 Analytics
- Historical trend analysis (Daily/Weekly/Monthly)
- Multi-parameter comparison charts
- Anomaly detection with statistical deviation
- Station-by-station comparison

### ⚠️ Alerts System
- Real-time climate alerts (Heatwaves, Storms, Air Quality, etc.)
- Severity-based categorization (Low, Medium, High, Critical)
- Alert resolution workflow
- Filter by severity, station, and status

### 🌐 Station Management
- 20 global monitoring stations
- Real-time data for each station
- Search and filter by region/country
- Detailed station cards with live readings

## Tech Stack

### Backend
- **Python 3.11+**
- **FastAPI** - High-performance async API framework
- **SQLAlchemy** - ORM for database operations
- **SQLite** - Lightweight database (easily swappable to PostgreSQL)
- **NumPy/Pandas** - Data processing and analytics
- **Scikit-learn** - Anomaly detection algorithms

### Frontend
- **React 18** with TypeScript
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **Leaflet** - Interactive maps
- **Recharts** - Data visualization
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons

## Project Structure

```
climate-monitoring-system/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes.py          # API endpoints
│   │   ├── models/
│   │   │   ├── database.py        # Database models
│   │   │   └── schemas.py         # Pydantic schemas
│   │   ├── analytics/
│   │   │   └── climate_analytics.py # Analytics functions
│   │   └── main.py                # FastAPI application
│   ├── seed_data.py               # Database seeder
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard/         # Dashboard widgets
│   │   │   ├── Map/               # Map components
│   │   │   ├── Charts/            # Chart components
│   │   │   ├── Alerts/            # Alert components
│   │   │   └── Layout/            # Layout components
│   │   ├── pages/                 # Page components
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── services/              # API services
│   │   └── utils/                 # Utility functions
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── start.sh
└── README.md
```

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn

### Manual Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd climate-monitoring-system
   ```

2. **Setup Backend**
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   python seed_data.py
   uvicorn app.main:app --reload --port 8000
   ```

3. **Setup Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Docker Setup

```bash
docker-compose up --build
```

### Quick Start Script

```bash
chmod +x start.sh
./start.sh
```

## API Endpoints

### Stations
- `GET /api/v1/stations` - List all stations
- `GET /api/v1/stations/:id` - Get station details
- `POST /api/v1/stations` - Create new station

### Climate Data
- `GET /api/v1/stations/:id/climate-data` - Get historical data
- `POST /api/v1/climate-data` - Add new data point
- `GET /api/v1/realtime` - Get latest readings

### Map
- `GET /api/v1/map/layers/:type` - Get GeoJSON for map layers

### Alerts
- `GET /api/v1/alerts` - List alerts
- `POST /api/v1/alerts` - Create alert
- `PUT /api/v1/alerts/:id/resolve` - Resolve alert

### Analytics
- `GET /api/v1/analytics/trends` - Get trend data
- `GET /api/v1/analytics/anomalies` - Detect anomalies
- `GET /api/v1/analytics/compare` - Compare stations

### Statistics
- `GET /api/v1/stats/summary` - Get summary statistics

## Database Schema

### Stations
- `id`, `name`, `latitude`, `longitude`, `elevation`
- `region`, `country`, `is_active`, `created_at`

### Climate Data
- `station_id`, `timestamp`
- `temperature`, `humidity`, `wind_speed`, `wind_direction`
- `pressure`, `precipitation`
- `aqi`, `pm25`, `pm10`, `co2`
- `uv_index`, `visibility`, `cloud_cover`

### Alerts
- `station_id`, `alert_type`, `severity`
- `title`, `message`, `is_active`
- `created_at`, `resolved_at`

## Key Features

### Real-time Monitoring
- Live data updates every 30 seconds
- WebSocket-ready architecture
- Auto-refreshing dashboard widgets

### Data Visualization
- Interactive choropleth maps
- Time-series charts with zoom
- Multi-parameter comparisons
- Responsive design for all devices

### Analytics Engine
- Statistical anomaly detection (Z-score)
- Trend analysis with customizable periods
- Heat index calculations
- AQI categorization

### Alert Management
- Configurable thresholds
- Severity-based prioritization
- Resolution tracking
- Historical alert log

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) - Modern web framework
- [React](https://react.dev/) - UI library
- [Leaflet](https://leafletjs.com/) - Interactive maps
- [Recharts](https://recharts.org/) - Charting library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
