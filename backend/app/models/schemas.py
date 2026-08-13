from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum


class AlertSeverity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class AlertType(str, Enum):
    HEATWAVE = "heatwave"
    COLD_SNAP = "cold_snap"
    FLOOD = "flood"
    DROUGHT = "drought"
    STORM = "storm"
    AIR_QUALITY = "air_quality"
    CUSTOM = "custom"


class StationCreate(BaseModel):
    name: str
    latitude: float
    longitude: float
    elevation: float = 0
    region: str
    country: str = "Unknown"


class StationResponse(BaseModel):
    id: int
    name: str
    latitude: float
    longitude: float
    elevation: float
    region: str
    country: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class ClimateDataCreate(BaseModel):
    station_id: int
    timestamp: datetime
    temperature: float
    humidity: float
    wind_speed: float = 0
    wind_direction: float = 0
    pressure: float = 1013.25
    precipitation: float = 0
    aqi: int = 0
    pm25: float = 0
    pm10: float = 0
    co2: float = 400
    uv_index: float = 0
    visibility: float = 10
    cloud_cover: float = 0


class ClimateDataResponse(BaseModel):
    id: int
    station_id: int
    timestamp: datetime
    temperature: float
    humidity: float
    wind_speed: float
    wind_direction: float
    pressure: float
    precipitation: float
    aqi: int
    pm25: float
    pm10: float
    co2: float
    uv_index: float
    visibility: float
    cloud_cover: float

    class Config:
        from_attributes = True


class AlertCreate(BaseModel):
    station_id: int
    alert_type: AlertType
    severity: AlertSeverity
    title: str
    message: str


class AlertResponse(BaseModel):
    id: int
    station_id: int
    alert_type: str
    severity: str
    title: str
    message: str
    is_active: bool
    created_at: datetime
    resolved_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserCreate(BaseModel):
    email: str
    username: str
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class UserLocationCreate(BaseModel):
    name: str
    latitude: float
    longitude: float
    temp_threshold_high: float = 35
    temp_threshold_low: float = 0
    aqi_threshold: int = 150
    notify_email: bool = True
    notify_push: bool = True


class UserLocationResponse(BaseModel):
    id: int
    user_id: int
    name: str
    latitude: float
    longitude: float
    temp_threshold_high: float
    temp_threshold_low: float
    aqi_threshold: int
    notify_email: bool
    notify_push: bool

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class TrendResponse(BaseModel):
    period: str
    avg_temperature: float
    avg_humidity: float
    total_precipitation: float
    avg_aqi: float
    avg_wind_speed: float
    data_points: int


class AnomalyResponse(BaseModel):
    station_id: int
    station_name: str
    timestamp: datetime
    parameter: str
    value: float
    expected_range_min: float
    expected_range_max: float
    deviation: float


class MapLayerResponse(BaseModel):
    type: str
    features: List[dict]


class RealtimeDataResponse(BaseModel):
    station_id: int
    station_name: str
    latitude: float
    longitude: float
    temperature: float
    humidity: float
    wind_speed: float
    aqi: int
    timestamp: datetime
