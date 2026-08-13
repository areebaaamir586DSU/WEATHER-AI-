from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Text, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import enum

DATABASE_URL = "sqlite:///./climate_monitoring.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class AlertSeverity(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class AlertType(str, enum.Enum):
    HEATWAVE = "heatwave"
    COLD_SNAP = "cold_snap"
    FLOOD = "flood"
    DROUGHT = "drought"
    STORM = "storm"
    AIR_QUALITY = "air_quality"
    CUSTOM = "custom"


class Station(Base):
    __tablename__ = "stations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    elevation = Column(Float, default=0)
    region = Column(String, nullable=False)
    country = Column(String, default="Unknown")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    climate_data = relationship("ClimateData", back_populates="station")
    alerts = relationship("Alert", back_populates="station")


class ClimateData(Base):
    __tablename__ = "climate_data"

    id = Column(Integer, primary_key=True, index=True)
    station_id = Column(Integer, ForeignKey("stations.id"), nullable=False)
    timestamp = Column(DateTime, nullable=False, index=True)
    temperature = Column(Float, nullable=False)
    humidity = Column(Float, nullable=False)
    wind_speed = Column(Float, default=0)
    wind_direction = Column(Float, default=0)
    pressure = Column(Float, default=1013.25)
    precipitation = Column(Float, default=0)
    aqi = Column(Integer, default=0)
    pm25 = Column(Float, default=0)
    pm10 = Column(Float, default=0)
    co2 = Column(Float, default=400)
    uv_index = Column(Float, default=0)
    visibility = Column(Float, default=10)
    cloud_cover = Column(Float, default=0)

    station = relationship("Station", back_populates="climate_data")


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    station_id = Column(Integer, ForeignKey("stations.id"), nullable=False)
    alert_type = Column(String, nullable=False)
    severity = Column(String, nullable=False)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

    station = relationship("Station", back_populates="alerts")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    username = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    locations = relationship("UserLocation", back_populates="user")


class UserLocation(Base):
    __tablename__ = "user_locations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    temp_threshold_high = Column(Float, default=35)
    temp_threshold_low = Column(Float, default=0)
    aqi_threshold = Column(Integer, default=150)
    notify_email = Column(Boolean, default=True)
    notify_push = Column(Boolean, default=True)

    user = relationship("User", back_populates="locations")


class SatelliteData(Base):
    __tablename__ = "satellite_data"

    id = Column(Integer, primary_key=True, index=True)
    region = Column(String, nullable=False)
    timestamp = Column(DateTime, nullable=False, index=True)
    ndvi = Column(Float, default=0)
    sea_surface_temp = Column(Float, default=0)
    ice_extent = Column(Float, default=0)
    solar_radiation = Column(Float, default=0)
    evapotranspiration = Column(Float, default=0)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    Base.metadata.create_all(bind=engine)
