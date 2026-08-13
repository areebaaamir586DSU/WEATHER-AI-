from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import datetime, timedelta
from typing import List, Optional
import numpy as np

from app.models.database import ClimateData, Station
from app.models.schemas import TrendResponse, AnomalyResponse


def get_trends(
    db: Session,
    station_id: Optional[int] = None,
    period: str = "monthly",
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None
) -> List[TrendResponse]:
    if not end_date:
        end_date = datetime.utcnow()
    if not start_date:
        start_date = end_date - timedelta(days=365)

    query = db.query(ClimateData).filter(
        ClimateData.timestamp >= start_date,
        ClimateData.timestamp <= end_date
    )

    if station_id:
        query = query.filter(ClimateData.station_id == station_id)

    if period == "daily":
        time_group = func.date(ClimateData.timestamp)
    elif period == "weekly":
        time_group = func.strftime("%Y-W%W", ClimateData.timestamp)
    else:
        time_group = func.strftime("%Y-%m", ClimateData.timestamp)

    results = (
        query.with_entities(
            time_group.label("period"),
            func.avg(ClimateData.temperature).label("avg_temperature"),
            func.avg(ClimateData.humidity).label("avg_humidity"),
            func.sum(ClimateData.precipitation).label("total_precipitation"),
            func.avg(ClimateData.aqi).label("avg_aqi"),
            func.avg(ClimateData.wind_speed).label("avg_wind_speed"),
            func.count(ClimateData.id).label("data_points"),
        )
        .group_by(time_group)
        .order_by(time_group)
        .all()
    )

    return [
        TrendResponse(
            period=str(r.period),
            avg_temperature=round(r.avg_temperature, 1),
            avg_humidity=round(r.avg_humidity, 1),
            total_precipitation=round(r.total_precipitation, 1),
            avg_aqi=round(r.avg_aqi, 1),
            avg_wind_speed=round(r.avg_wind_speed, 1),
            data_points=r.data_points,
        )
        for r in results
    ]


def detect_anomalies(
    db: Session,
    station_id: Optional[int] = None,
    days: int = 30,
    threshold: float = 2.0
) -> List[AnomalyResponse]:
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=days)

    query = db.query(ClimateData).filter(
        ClimateData.timestamp >= start_date,
        ClimateData.timestamp <= end_date
    )
    if station_id:
        query = query.filter(ClimateData.station_id == station_id)

    data = query.all()
    if not data:
        return []

    temps = np.array([d.temperature for d in data])
    humidities = np.array([d.humidity for d in data])
    aqis = np.array([d.aqi for d in data])

    anomalies = []

    for d in data:
        temp_mean, temp_std = np.mean(temps), np.std(temps)
        hum_mean, hum_std = np.mean(humidities), np.std(humidities)
        aqi_mean, aqi_std = np.mean(aqis), np.std(aqis)

        if temp_std > 0 and abs(d.temperature - temp_mean) > threshold * temp_std:
            anomalies.append(AnomalyResponse(
                station_id=d.station_id,
                station_name=d.station.name if d.station else "Unknown",
                timestamp=d.timestamp,
                parameter="temperature",
                value=d.temperature,
                expected_range_min=round(temp_mean - threshold * temp_std, 1),
                expected_range_max=round(temp_mean + threshold * temp_std, 1),
                deviation=round((d.temperature - temp_mean) / temp_std, 2),
            ))

        if hum_std > 0 and abs(d.humidity - hum_mean) > threshold * hum_std:
            anomalies.append(AnomalyResponse(
                station_id=d.station_id,
                station_name=d.station.name if d.station else "Unknown",
                timestamp=d.timestamp,
                parameter="humidity",
                value=d.humidity,
                expected_range_min=round(hum_mean - threshold * hum_std, 1),
                expected_range_max=round(hum_mean + threshold * hum_std, 1),
                deviation=round((d.humidity - hum_mean) / hum_std, 2),
            ))

        if aqi_std > 0 and abs(d.aqi - aqi_mean) > threshold * aqi_std:
            anomalies.append(AnomalyResponse(
                station_id=d.station_id,
                station_name=d.station.name if d.station else "Unknown",
                timestamp=d.timestamp,
                parameter="aqi",
                value=float(d.aqi),
                expected_range_min=round(aqi_mean - threshold * aqi_std, 1),
                expected_range_max=round(aqi_mean + threshold * aqi_std, 1),
                deviation=round((d.aqi - aqi_mean) / aqi_std, 2),
            ))

    anomalies.sort(key=lambda x: abs(x.deviation), reverse=True)
    return anomalies[:50]


def get_comparative_analysis(
    db: Session,
    station_ids: List[int],
    days: int = 30
) -> dict:
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=days)

    results = {}
    for sid in station_ids:
        data = (
            db.query(ClimateData)
            .filter(ClimateData.station_id == sid, ClimateData.timestamp >= start_date)
            .all()
        )
        if data:
            results[sid] = {
                "avg_temperature": round(np.mean([d.temperature for d in data]), 1),
                "avg_humidity": round(np.mean([d.humidity for d in data]), 1),
                "avg_aqi": round(np.mean([d.aqi for d in data]), 1),
                "total_precipitation": round(sum(d.precipitation for d in data), 1),
                "avg_wind_speed": round(np.mean([d.wind_speed for d in data]), 1),
                "data_points": len(data),
            }
    return results


def get_heat_index(temperature: float, humidity: float) -> float:
    if temperature < 27:
        return temperature
    hi = (
        -8.7847
        + 1.6114 * temperature
        + 2.3385 * humidity
        - 0.1461 * temperature * humidity
        - 0.0068 * temperature ** 2
        - 0.0548 * humidity ** 2
        + 0.0013 * temperature ** 2 * humidity
        + 0.0008 * temperature * humidity ** 2
        - 0.00001 * temperature ** 2 * humidity ** 2
    )
    return round(hi, 1)


def get_aqi_category(aqi: int) -> dict:
    if aqi <= 50:
        return {"category": "Good", "color": "#00e400", "advice": "Air quality is satisfactory."}
    elif aqi <= 100:
        return {"category": "Moderate", "color": "#ffff00", "advice": "Acceptable quality. Moderate concern for sensitive individuals."}
    elif aqi <= 150:
        return {"category": "Unhealthy for Sensitive Groups", "color": "#ff7e00", "advice": "Sensitive groups may experience health effects."}
    elif aqi <= 200:
        return {"category": "Unhealthy", "color": "#ff0000", "advice": "Everyone may begin to experience health effects."}
    elif aqi <= 300:
        return {"category": "Very Unhealthy", "color": "#8f3f97", "advice": "Health alert: everyone may experience more serious health effects."}
    else:
        return {"category": "Hazardous", "color": "#7e0023", "advice": "Health warning of emergency conditions."}
