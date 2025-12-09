from datetime import datetime, timezone
from . import db


class TimestampMixin:
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    updated_at = db.Column(
        db.DateTime,
        default=datetime.now(timezone.utc),
        onupdate=datetime.now(timezone.utc),
    )


class Station(TimestampMixin, db.Model):
    __tablename__ = "stations"

    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(10), unique=True, nullable=False)   # e.g. "VIC"
    name = db.Column(db.String(100), nullable=False)               # e.g. "London Victoria"

    def __repr__(self):
        return f"<Station {self.code} - {self.name}>"


class Service(TimestampMixin, db.Model):
    __tablename__ = "services"

    id = db.Column(db.Integer, primary_key=True)
    
    train_uid = db.Column(db.String(50), nullable=False)
    operator = db.Column(db.String(50))
    origin = db.Column(db.String(100))
    destination = db.Column(db.String(100))
    scheduled_time = db.Column(db.String(10))   # HH:MM format from API

    # relationships
    snapshots = db.relationship("ServiceSnapshot", backref="service", lazy=True)


class ServiceSnapshot(TimestampMixin, db.Model):
    __tablename__ = "service_snapshots"

    id = db.Column(db.Integer, primary_key=True)

    service_id = db.Column(
        db.Integer,
        db.ForeignKey("services.id"),
        nullable=False,
    )
    
    station_id = db.Column(
        db.Integer,
        db.ForeignKey("stations.id"),
        nullable=False,
    )

    timestamp = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    expected_time = db.Column(db.String(10))
    delay_minutes = db.Column(db.Integer)
    platform = db.Column(db.String(10))
    status = db.Column(db.String(50))


class ScrapeLog(TimestampMixin, db.Model):
    __tablename__ = "scrape_logs"

    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    total_services = db.Column(db.Integer)
    successful = db.Column(db.Integer)
    failed = db.Column(db.Integer)
    avg_delay = db.Column(db.Float)
    notes = db.Column(db.String(255))

