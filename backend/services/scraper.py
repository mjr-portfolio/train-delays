import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
# Allow the scraper to run correctly when Railway executes it from a
# different working directory. This ensures `import app` still resolves.

from app import create_app
from db import db
from db.models import Station, Service, ServiceSnapshot, ScrapeLog

from services.transport_api import TransportAPI
from services.transform import normalise_service, normalise_snapshot

from datetime import datetime, timezone

import logging
logging.basicConfig(level=logging.INFO)


def run_scraper():
    """
    Main scraping task.
    - Loads the Flask app + DB context
    - Fetches departures for every station
    - Normalises raw API data into our internal models
    - Upserts `Service` rows (one per train per schedule)
    - Inserts `ServiceSnapshot` rows (one per scrape)
    - Records a summary log so the dashboard can show trends
    """

    app = create_app()
    client = TransportAPI()

    logging.info("Scraper starting…")

    # Flask requires an application context for DB operations
    with app.app_context():

        stations = Station.query.all()

        logging.info(f"Loaded {len(stations)} stations")

        total_services = 0
        successful = 0
        failed = 0

        # Loop through each station we choose to track - which currently covers 4
        for station in stations:
            logging.info(f"Scraping station: {station.code}")

            try:
                # Fetch raw departures from TransportAPI
                data = client.get_departures(station.code)
                departures = data.get("departures", {}).get("all", [])

                # Process each raw departure item
                for raw in departures:
                    total_services += 1

                    # normalise external api data to designed internal format
                    service_data = normalise_service(raw)
                    snapshot_data = normalise_snapshot(raw, station_id=station.id)

                    # upsert service (One service per train_uid + scheduled_time)
                    service = Service.query.filter_by(
                        train_uid=service_data["train_uid"],
                        scheduled_time=service_data["scheduled_time"],
                    ).first()

                    if not service:
                        # New service → insert then flush to get its ID
                        service = Service(**service_data)
                        db.session.add(service)
                        db.session.flush()  # ensures service.id is available

                    # Always create a new snapshot to get current state
                    snapshot = ServiceSnapshot(
                        service_id=service.id,
                        **snapshot_data
                    )
                    db.session.add(snapshot)

                    successful += 1

            except Exception as e:
                failed += 1
                logging.error(f"Error scraping {station.code}: {e}")

        logging.info("pre snapshots")

        # Compute avg delay from *this run’s* newly recorded snapshots
        # (Used by the frontend to plot a trend over time)
        avg_delay = 0

        snapshots = ServiceSnapshot.query.filter(
            ServiceSnapshot.timestamp >= datetime.now(timezone.utc).replace(second=0, microsecond=0)
        ).all()

        if snapshots:
            delays = [s.delay_minutes for s in snapshots if s.delay_minutes is not None]
            if delays:
                avg_delay = sum(delays) / len(delays)

        logging.info("pre scrapelog")

        # Insert a summary record so the dashboard can show:
        # - number of trains seen
        # - failures
        # - average delay
        # - timestamp
        log = ScrapeLog(
            timestamp=datetime.now(timezone.utc),
            total_services=total_services,
            successful=successful,
            failed=failed,
            avg_delay=avg_delay,
        )
        db.session.add(log)
        db.session.commit()

        logging.info(f"Scrape finished. Total: {total_services}, OK: {successful}, Failed: {failed}")

        print("SCRAPE COMPLETE:", total_services, "services")

if __name__ == "__main__":
    # Allow local manual runs for testing
    run_scraper()
