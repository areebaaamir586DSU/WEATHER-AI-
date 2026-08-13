import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.models.database import SessionLocal, init_db, Station, ClimateData, Alert
from datetime import datetime, timedelta
import random
import math

STATIONS = [
    {"name": "New York Central Park", "latitude": 40.7829, "longitude": -73.9654, "elevation": 42, "region": "Northeast", "country": "USA"},
    {"name": "London Heathrow", "latitude": 51.4700, "longitude": -0.4543, "elevation": 25, "region": "Europe", "country": "UK"},
    {"name": "Tokyo Shinjuku", "latitude": 35.6895, "longitude": 139.6917, "elevation": 40, "region": "Asia Pacific", "country": "Japan"},
    {"name": "Sydney Observatory", "latitude": -33.8568, "longitude": 151.2153, "elevation": 58, "region": "Oceania", "country": "Australia"},
    {"name": "Dubai International", "latitude": 25.2532, "longitude": 55.3657, "elevation": 5, "region": "Middle East", "country": "UAE"},
    {"name": "Mumbai Coastal", "latitude": 19.0760, "longitude": 72.8777, "elevation": 14, "region": "South Asia", "country": "India"},
    {"name": "São Paulo Paulista", "latitude": -23.5505, "longitude": -46.6333, "elevation": 760, "region": "South America", "country": "Brazil"},
    {"name": "Cairo Downtown", "latitude": 30.0444, "longitude": 31.2357, "elevation": 75, "region": "Africa", "country": "Egypt"},
    {"name": "Moscow Kremlin", "latitude": 55.7558, "longitude": 37.6173, "elevation": 156, "region": "Europe", "country": "Russia"},
    {"name": "Beijing Tiananmen", "latitude": 39.9042, "longitude": 116.4074, "elevation": 43, "region": "Asia Pacific", "country": "China"},
    {"name": "Paris Eiffel Tower", "latitude": 48.8566, "longitude": 2.3522, "elevation": 35, "region": "Europe", "country": "France"},
    {"name": "Los Angeles Downtown", "latitude": 34.0522, "longitude": -118.2437, "elevation": 71, "region": "West Coast", "country": "USA"},
    {"name": "Singapore Marina Bay", "latitude": 1.2838, "longitude": 103.8591, "elevation": 3, "region": "Southeast Asia", "country": "Singapore"},
    {"name": "Berlin Mitte", "latitude": 52.5200, "longitude": 13.4050, "elevation": 34, "region": "Europe", "country": "Germany"},
    {"name": "Cape Town Waterfront", "latitude": -33.9249, "longitude": 18.4241, "elevation": 0, "region": "Africa", "country": "South Africa"},
    {"name": "Seoul Gangnam", "latitude": 37.4999, "longitude": 127.0374, "elevation": 15, "region": "Asia Pacific", "country": "South Korea"},
    {"name": "Toronto Harbour", "latitude": 43.6532, "longitude": -79.3832, "elevation": 76, "region": "North America", "country": "Canada"},
    {"name": "Mexico City Centro", "latitude": 19.4326, "longitude": -99.1332, "elevation": 2240, "region": "North America", "country": "Mexico"},
    {"name": "Jakarta Central", "latitude": -6.2088, "longitude": 106.8456, "elevation": 8, "region": "Southeast Asia", "country": "Indonesia"},
    {"name": "Bangkok Sukhumvit", "latitude": 13.7563, "longitude": 100.5018, "elevation": 2, "region": "Southeast Asia", "country": "Thailand"},
]

def generate_climate_data(station_id, start_date, days=90):
    data = []
    base_temp = random.uniform(5, 35)
    base_humidity = random.uniform(30, 80)
    base_aqi = random.randint(20, 150)

    for day in range(days):
        date = start_date + timedelta(days=day)
        day_of_year = date.timetuple().tm_yday

        seasonal_temp = 10 * math.sin(2 * math.pi * (day_of_year - 80) / 365)
        temp = base_temp + seasonal_temp + random.gauss(0, 3)
        humidity = max(10, min(100, base_humidity + random.gauss(0, 10)))
        wind_speed = max(0, random.gauss(12, 5))
        wind_direction = random.uniform(0, 360)
        pressure = max(980, min(1040, 1013.25 + random.gauss(0, 8)))
        precipitation = max(0, random.gauss(2, 3)) if random.random() < 0.3 else 0
        aqi = max(0, min(500, base_aqi + random.gauss(0, 20)))
        pm25 = max(0, aqi * 0.5 + random.gauss(0, 5))
        pm10 = max(0, pm25 * 1.5 + random.gauss(0, 10))
        co2 = max(350, 410 + random.gauss(0, 5))
        uv_index = max(0, min(11, 6 + 4 * math.sin(2 * math.pi * (day_of_year - 80) / 365) + random.gauss(0, 1)))
        visibility = max(0.5, min(30, 10 + random.gauss(0, 3)))
        cloud_cover = max(0, min(100, random.gauss(50, 25)))

        for hour in range(0, 24, 6):
            timestamp = date + timedelta(hours=hour)
            hour_temp = temp + random.gauss(0, 2) + (2 if 6 <= hour <= 18 else -2)

            data.append(ClimateData(
                station_id=station_id,
                timestamp=timestamp,
                temperature=round(hour_temp, 1),
                humidity=round(humidity + random.gauss(0, 5), 1),
                wind_speed=round(max(0, wind_speed + random.gauss(0, 2)), 1),
                wind_direction=round(wind_direction, 1),
                pressure=round(pressure + random.gauss(0, 1), 1),
                precipitation=round(max(0, precipitation + random.gauss(0, 0.5)), 1),
                aqi=int(max(0, min(500, aqi + random.gauss(0, 10)))),
                pm25=round(max(0, pm25 + random.gauss(0, 3)), 1),
                pm10=round(max(0, pm10 + random.gauss(0, 5)), 1),
                co2=round(co2 + random.gauss(0, 2), 1),
                uv_index=round(max(0, uv_index + random.gauss(0, 0.5)), 1),
                visibility=round(max(0.5, visibility + random.gauss(0, 1)), 1),
                cloud_cover=round(max(0, min(100, cloud_cover + random.gauss(0, 10))), 1),
            ))
    return data


def generate_alerts(stations):
    alerts = []
    alert_templates = [
        {"type": "heatwave", "severity": "high", "title": "Extreme Heat Warning", "message": "Temperature exceeding {temp}°C for extended period. Stay hydrated and avoid outdoor activities."},
        {"type": "air_quality", "severity": "medium", "title": "Poor Air Quality", "message": "AQI levels at {aqi}. Sensitive groups should limit outdoor exposure."},
        {"type": "storm", "severity": "critical", "title": "Severe Storm Alert", "message": "High winds and heavy precipitation expected. Seek shelter immediately."},
        {"type": "cold_snap", "severity": "medium", "title": "Frost Advisory", "message": "Temperatures expected to drop below {temp}°C. Protect sensitive vegetation."},
        {"type": "flood", "severity": "high", "title": "Flood Watch", "message": "Heavy rainfall may cause localized flooding. Avoid low-lying areas."},
        {"type": "drought", "severity": "low", "title": "Drought Conditions", "message": "Extended dry period. Water conservation recommended."},
    ]

    for station in stations[:8]:
        template = random.choice(alert_templates)
        alerts.append(Alert(
            station_id=station.id,
            alert_type=template["type"],
            severity=template["severity"],
            title=template["title"],
            message=template["message"].format(temp=random.randint(30, 45), aqi=random.randint(100, 300)),
            is_active=random.choice([True, True, False]),
            created_at=datetime.utcnow() - timedelta(days=random.randint(0, 7)),
        ))
    return alerts


def seed_database():
    init_db()
    db = SessionLocal()

    existing = db.query(Station).count()
    if existing > 0:
        print(f"Database already has {existing} stations. Skipping seed.")
        db.close()
        return

    print("Seeding stations...")
    stations = []
    for station_data in STATIONS:
        station = Station(**station_data)
        db.add(station)
        stations.append(station)
    db.commit()

    print("Seeding climate data...")
    start_date = datetime.utcnow() - timedelta(days=90)
    for station in stations:
        climate_data = generate_climate_data(station.id, start_date)
        db.bulk_save_objects(climate_data)
        print(f"  Added {len(climate_data)} records for {station.name}")
    db.commit()

    print("Seeding alerts...")
    alerts = generate_alerts(stations)
    db.bulk_save_objects(alerts)
    db.commit()

    total_data = db.query(ClimateData).count()
    total_alerts = db.query(Alert).count()
    print(f"\nSeed complete!")
    print(f"  Stations: {len(stations)}")
    print(f"  Climate records: {total_data}")
    print(f"  Alerts: {total_alerts}")

    db.close()


if __name__ == "__main__":
    seed_database()
