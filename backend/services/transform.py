from datetime import datetime


def normalise_service(raw):
    """
    Takes one departure item and returns our internal service representation.
    """

    return {
        "train_uid": raw.get("train_uid"),
        "operator": raw.get("operator_name") or raw.get("operator"),
        "origin": raw.get("origin_name"),
        "destination": raw.get("destination_name"),
        "scheduled_time": raw.get("aimed_departure_time"),
    }


def normalise_snapshot(raw, station_id):
    """
    Takes one departure item and returns our snapshot representation.
    """

    # delay in minutes (TransportAPI gives a field but let's calculate)
    aimed = raw.get("aimed_departure_time")
    expected = raw.get("expected_departure_time")

    # calculate delay if both exist and formatted HH:MM
    delay = None
    if aimed and expected:
        try:
            aimed_dt = datetime.strptime(aimed, "%H:%M")
            expected_dt = datetime.strptime(expected, "%H:%M")
            delay = int((expected_dt - aimed_dt).total_seconds() / 60)
        except Exception:
            delay = None

    return {
        "station_id": station_id,
        "expected_time": expected,
        "delay_minutes": delay,
        "platform": raw.get("platform"),
        "status": raw.get("status"),
    }
