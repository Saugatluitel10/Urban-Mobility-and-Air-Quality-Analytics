from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import JSONB, TIMESTAMP
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry

Base = declarative_base()

class City(Base):
    __tablename__ = "cities"
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    boundary = Column(Geometry("POLYGON"), nullable=True)  # Geo boundary

class Sensor(Base):
    __tablename__ = "sensors"
    id = Column(Integer, primary_key=True)
    city_id = Column(Integer, ForeignKey("cities.id"))
    type = Column(String, nullable=False)  # 'air' or 'traffic'
    location = Column(Geometry("POINT"), nullable=False)
    meta = Column(JSONB, nullable=True)
    city = relationship("City", back_populates="sensors")

City.sensors = relationship("Sensor", order_by=Sensor.id, back_populates="city")

class AirQualityReading(Base):
    __tablename__ = "air_quality_readings"
    id = Column(Integer, primary_key=True)
    sensor_id = Column(Integer, ForeignKey("sensors.id"))
    timestamp = Column(TIMESTAMP, nullable=False)
    pm25 = Column(Float)
    pm10 = Column(Float)
    no2 = Column(Float)
    o3 = Column(Float)
    aqi = Column(Float)
    meta = Column(JSONB, nullable=True)
    sensor = relationship("Sensor")

class TrafficReading(Base):
    __tablename__ = "traffic_readings"
    id = Column(Integer, primary_key=True)
    sensor_id = Column(Integer, ForeignKey("sensors.id"))
    timestamp = Column(TIMESTAMP, nullable=False)
    speed = Column(Float)
    volume = Column(Float)
    congestion_index = Column(Float)
    meta = Column(JSONB, nullable=True)
    sensor = relationship("Sensor")
