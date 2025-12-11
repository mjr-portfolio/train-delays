from datetime import datetime


def normalise_service(raw):
    """
    Convert a raw TransportAPI service into our internal format.
    We apply fallbacks to ensure the DB never receives None in
    user-visible fields — this keeps frontend rendering predictable.
    """

    return {
        "train_uid": raw.get("train_uid") or "-",
        "operator": raw.get("operator_name") or raw.get("operator") or "-",
        "origin": raw.get("origin_name") or "-",
        "destination": raw.get("destination_name") or "-",
        "scheduled_time": raw.get("aimed_departure_time") or "-",
    }


def normalise_snapshot(raw, station_id):
    """
    Convert a raw TransportAPI service into a `ServiceSnapshot`, which represents
    the state of a specific train at the moment of scraping.

    - Snapshots are historical; we record one per scrape
    - Delay is computed manually so we aren't dependent on API quirks
    - Missing fields fall back to simple defaults for frontend stability
    """

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

    # Some fallbacks are left to default to None where more applicable
    return {
        "station_id": station_id,
        "expected_time": expected or "-",
        "delay_minutes": delay,
        "platform": raw.get("platform") or "-",
        "status": raw.get("status") or "-",
    }
