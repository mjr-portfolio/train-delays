from flask import jsonify, request
from . import services_bp

from db.models import Service, ServiceSnapshot, Station


@services_bp.get("/api/services")
def list_services():

    station_code = request.args.get("station")

    query = Service.query

    if station_code:
        station = Station.query.filter_by(code=station_code).first()
        if station:
            # join via snapshots to filter by station
            query = (
                query.join(Service.snapshots)
                .filter_by(station_id=station.id)
            )

    services = query.order_by(Service.id.desc()).limit(50).all()

    return jsonify([
        {
            "id": s.id,
            "train_uid": s.train_uid,
            "operator": s.operator,
            "origin": s.origin,
            "destination": s.destination,
            "scheduled_time": s.scheduled_time,
        }
        for s in services
    ])


@services_bp.get("/api/services/<int:id>")
def get_service_detail(id):
    service = Service.query.get_or_404(id)

    # find the most recent snapshot for display
    latest_snapshot = (
        ServiceSnapshot.query
        .filter_by(service_id=id)
        .order_by(ServiceSnapshot.id.desc())
        .first()
    )

    return jsonify({
        "id": service.id,
        "train_uid": service.train_uid,
        "operator": service.operator,
        "origin": service.origin,
        "destination": service.destination,
        "scheduled_time": service.scheduled_time,
        "latest": {
            "expected_time": latest_snapshot.expected_time if latest_snapshot else None,
            "delay_minutes": latest_snapshot.delay_minutes if latest_snapshot else None,
            "platform": latest_snapshot.platform if latest_snapshot else None,
            "status": latest_snapshot.status if latest_snapshot else None,
        }
    })


@services_bp.get("/api/services/<int:id>/history")
def get_service_history(id):
    service = Service.query.get_or_404(id)

    snapshots = (
        ServiceSnapshot.query
        .filter_by(service_id=id)
        .order_by(ServiceSnapshot.id.asc())   # oldest first for charts
        .all()
    )

    return jsonify({
        "id": service.id,
        "train_uid": service.train_uid,
        "history": [
            {
                "timestamp": s.timestamp.isoformat(),
                "expected_time": s.expected_time,
                "delay_minutes": s.delay_minutes,
                "platform": s.platform,
                "status": s.status,
                "station_id": s.station_id
            }
            for s in snapshots
        ]
    })
