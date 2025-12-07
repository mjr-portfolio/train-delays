from flask import jsonify
from . import stations_bp

from db import db
from db.models import Station, ServiceSnapshot
from sqlalchemy import func


@stations_bp.get("/api/stations")
def list_stations():
    stations = Station.query.order_by(Station.name).all()

    return jsonify([
        {
            "id": s.id,
            "code": s.code,
            "name": s.name,
        }
        for s in stations
    ])


@stations_bp.get("/api/stations/<code>/avg-delay")
def average_delay_for_station(code):
    station = Station.query.filter_by(code=code).first_or_404()

    result = (
        db.session.query(func.avg(ServiceSnapshot.delay_minutes))
        .filter(ServiceSnapshot.station_id == station.id)
        .filter(ServiceSnapshot.delay_minutes.isnot(None))
        .scalar()
    )

    return jsonify({
        "station": station.code,
        "average_delay": float(result) if result is not None else None,
    })


@stations_bp.get("/api/stations/delays/recent")
def recent_delays_by_station():

    # limit to recent snapshots (last 100 for now)
    subquery = (
        db.session.query(
            ServiceSnapshot.station_id,
            ServiceSnapshot.delay_minutes
        )
        .filter(ServiceSnapshot.delay_minutes.isnot(None))
        .order_by(ServiceSnapshot.id.desc())
        .limit(100)
        .subquery()
    )

    results = (
        db.session.query(
            Station.code,
            func.avg(subquery.c.delay_minutes)
        )
        .join(Station, Station.id == subquery.c.station_id)
        .group_by(Station.code)
        .all()
    )

    return jsonify([
        {
            "station": code,
            "avg_delay": float(avg) if avg is not None else None
        }
        for code, avg in results
    ])
