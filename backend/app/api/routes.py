from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime, timedelta

from app.models.database import get_db, Station, ClimateData, Alert
from app.models.schemas import (
    StationCreate, StationResponse,
    ClimateDataCreate, ClimateDataResponse,
    AlertCreate, AlertResponse,
    TrendResponse, AnomalyResponse, MapLayerResponse, RealtimeDataResponse
)
from app.analytics.climate_analytics import (
    get_trends, detect_anomalies, get_comparative_analysis,
    get_heat_index, get_aqi_category
)

router = APIRouter()


# ==================== STATIONS ====================

@router.get("/stations", response_model=List[StationResponse])
def list_stations(
    region: Optional[str] = None,
    country: Optional[str] = None,
    is_active: Optional[bool] = True,
    db: Session = Depends(get_db)
):
    query = db.query(Station)
    if region:
        query = query.filter(Station.region == region)
    if country:
        query = query.filter(Station.country == country)
    if is_active is not None:
        query = query.filter(Station.is_active == is_active)
    return query.all()


@router.get("/stations/{station_id}", response_model=StationResponse)
def get_station(station_id: int, db: Session = Depends(get_db)):
    station = db.query(Station).filter(Station.id == station_id).first()
    if not station:
        raise HTTPException(status_code=404, detail="Station not found")
    return station


@router.post("/stations", response_model=StationResponse)
def create_station(station_data: StationCreate, db: Session = Depends(get_db)):
    station = Station(**station_data.model_dump())
    db.add(station)
    db.commit()
    db.refresh(station)
    return station


# ==================== CLIMATE DATA ====================

@router.get("/stations/{station_id}/climate-data", response_model=List[ClimateDataResponse])
def get_climate_data(
    station_id: int,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    limit: int = Query(default=100, le=1000),
    db: Session = Depends(get_db)
):
    station = db.query(Station).filter(Station.id == station_id).first()
    if not station:
        raise HTTPException(status_code=404, detail="Station not found")

    query = db.query(ClimateData).filter(ClimateData.station_id == station_id)
    if start_date:
        query = query.filter(ClimateData.timestamp >= start_date)
    if end_date:
        query = query.filter(ClimateData.timestamp <= end_date)

    return query.order_by(ClimateData.timestamp.desc()).limit(limit).all()


@router.post("/climate-data", response_model=ClimateDataResponse)
def create_climate_data(data: ClimateDataCreate, db: Session = Depends(get_db)):
    station = db.query(Station).filter(Station.id == data.station_id).first()
    if not station:
        raise HTTPException(status_code=404, detail="Station not found")

    climate_data = ClimateData(**data.model_dump())
    db.add(climate_data)
    db.commit()
    db.refresh(climate_data)
    return climate_data


@router.post("/climate-data/batch")
def create_climate_data_batch(data_list: List[ClimateDataCreate], db: Session = Depends(get_db)):
    created = 0
    for data in data_list:
        station = db.query(Station).filter(Station.id == data.station_id).first()
        if station:
            db.add(ClimateData(**data.model_dump()))
            created += 1
    db.commit()
    return {"created": created}


# ==================== REALTIME DATA ====================

@router.get("/realtime", response_model=List[RealtimeDataResponse])
def get_realtime_data(db: Session = Depends(get_db)):
    stations = db.query(Station).filter(Station.is_active == True).all()
    result = []

    for station in stations:
        latest = (
            db.query(ClimateData)
            .filter(ClimateData.station_id == station.id)
            .order_by(ClimateData.timestamp.desc())
            .first()
        )
        if latest:
            result.append(RealtimeDataResponse(
                station_id=station.id,
                station_name=station.name,
                latitude=station.latitude,
                longitude=station.longitude,
                temperature=latest.temperature,
                humidity=latest.humidity,
                wind_speed=latest.wind_speed,
                aqi=latest.aqi,
                timestamp=latest.timestamp,
            ))

    return result


# ==================== MAP LAYERS ====================

@router.get("/map/layers/{layer_type}")
def get_map_layer(layer_type: str, db: Session = Depends(get_db)):
    stations = db.query(Station).filter(Station.is_active == True).all()
    features = []

    for station in stations:
        latest = (
            db.query(ClimateData)
            .filter(ClimateData.station_id == station.id)
            .order_by(ClimateData.timestamp.desc())
            .first()
        )
        if not latest:
            continue

        if layer_type == "temperature":
            value = latest.temperature
        elif layer_type == "humidity":
            value = latest.humidity
        elif layer_type == "aqi":
            value = latest.aqi
        elif layer_type == "wind":
            value = latest.wind_speed
        elif layer_type == "precipitation":
            value = latest.precipitation
        else:
            value = 0

        features.append({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [station.longitude, station.latitude]
            },
            "properties": {
                "station_id": station.id,
                "station_name": station.name,
                "region": station.region,
                "value": value,
                "parameter": layer_type,
                "timestamp": latest.timestamp.isoformat(),
            }
        })

    return {
        "type": "FeatureCollection",
        "features": features,
        "layer_type": layer_type,
    }


# ==================== ALERTS ====================

@router.get("/alerts", response_model=List[AlertResponse])
def list_alerts(
    station_id: Optional[int] = None,
    severity: Optional[str] = None,
    is_active: Optional[bool] = None,
    limit: int = Query(default=50, le=200),
    db: Session = Depends(get_db)
):
    query = db.query(Alert)
    if station_id:
        query = query.filter(Alert.station_id == station_id)
    if severity:
        query = query.filter(Alert.severity == severity)
    if is_active is not None:
        query = query.filter(Alert.is_active == is_active)
    return query.order_by(Alert.created_at.desc()).limit(limit).all()


@router.post("/alerts", response_model=AlertResponse)
def create_alert(alert_data: AlertCreate, db: Session = Depends(get_db)):
    station = db.query(Station).filter(Station.id == alert_data.station_id).first()
    if not station:
        raise HTTPException(status_code=404, detail="Station not found")

    alert = Alert(**alert_data.model_dump())
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return alert


@router.put("/alerts/{alert_id}/resolve")
def resolve_alert(alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.is_active = False
    alert.resolved_at = datetime.utcnow()
    db.commit()
    return {"message": "Alert resolved"}


# ==================== ANALYTICS ====================

@router.get("/analytics/trends", response_model=List[TrendResponse])
def get_trends_endpoint(
    station_id: Optional[int] = None,
    period: str = Query(default="monthly", regex="^(daily|weekly|monthly)$"),
    days: int = Query(default=365, le=730),
    db: Session = Depends(get_db)
):
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=days)
    return get_trends(db, station_id, period, start_date, end_date)


@router.get("/analytics/anomalies", response_model=List[AnomalyResponse])
def get_anomalies_endpoint(
    station_id: Optional[int] = None,
    days: int = Query(default=30, le=90),
    threshold: float = Query(default=2.0, le=4.0),
    db: Session = Depends(get_db)
):
    return detect_anomalies(db, station_id, days, threshold)


@router.get("/analytics/compare")
def compare_stations(
    station_ids: str = Query(description="Comma-separated station IDs"),
    days: int = Query(default=30, le=90),
    db: Session = Depends(get_db)
):
    ids = [int(x) for x in station_ids.split(",")]
    return get_comparative_analysis(db, ids, days)


@router.get("/analytics/heat-index")
def calculate_heat_index(temperature: float, humidity: float):
    return {
        "temperature": temperature,
        "humidity": humidity,
        "heat_index": get_heat_index(temperature, humidity),
    }


@router.get("/analytics/aqi-category")
def get_aqi_info(aqi: int):
    return {"aqi": aqi, **get_aqi_category(aqi)}


# ==================== STATISTICS ====================

@router.get("/stats/summary")
def get_stats_summary(db: Session = Depends(get_db)):
    station_count = db.query(Station).filter(Station.is_active == True).count()
    data_count = db.query(ClimateData).count()
    alert_count = db.query(Alert).filter(Alert.is_active == True).count()

    latest_data = (
        db.query(ClimateData)
        .order_by(ClimateData.timestamp.desc())
        .first()
    )

    avg_temp = db.query(func.avg(ClimateData.temperature)).scalar() or 0
    avg_humidity = db.query(func.avg(ClimateData.humidity)).scalar() or 0
    avg_aqi = db.query(func.avg(ClimateData.aqi)).scalar() or 0

    return {
        "active_stations": station_count,
        "total_data_points": data_count,
        "active_alerts": alert_count,
        "latest_update": latest_data.timestamp.isoformat() if latest_data else None,
        "global_avg_temperature": round(avg_temp, 1),
        "global_avg_humidity": round(avg_humidity, 1),
        "global_avg_aqi": round(avg_aqi, 0),
    }
