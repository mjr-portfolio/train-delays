import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
# ^ Adding to allow cron jobs to work on Railway ^

from app import create_app
from db import db
from db.models import Station, Service, ServiceSnapshot, ScrapeLog

from services.transport_api import TransportAPI
from services.transform import normalise_service, normalise_snapshot

from datetime import datetime

import logging
logging.basicConfig(level=logging.INFO)


def run_scraper():
    app = create_app()
    client = TransportAPI()

    logging.info("Scraper starting…")

    with app.app_context():

        stations = Station.query.all()

        logging.info(f"Loaded {len(stations)} stations")

        total_services = 0
        successful = 0
        failed = 0

        for station in stations:
            logging.info(f"Scraping station: {station.code}")

            try:
                data = client.get_departures(station.code)
                departures = data.get("departures", {}).get("all", [])

                for raw in departures:
                    total_services += 1

                    # normalised objects
                    service_data = normalise_service(raw)
                    snapshot_data = normalise_snapshot(raw, station_id=station.id)

                    # upsert service (find by train_uid + scheduled_time)
                    service = Service.query.filter_by(
                        train_uid=service_data["train_uid"],
                        scheduled_time=service_data["scheduled_time"],
                    ).first()

                    if not service:
                        service = Service(**service_data)
                        db.session.add(service)
                        db.session.flush()  # ensures service.id is available

                    # add snapshot
                    snapshot = ServiceSnapshot(
                        service_id=service.id,
                        **snapshot_data
                    )
                    db.session.add(snapshot)

                    successful += 1

            except Exception as e:
                failed += 1
                print("ERROR:", station.code, str(e))

        logging.info("pre scrapelog")

        # scrape log
        log = ScrapeLog(
            timestamp=datetime.utcnow(),
            total_services=total_services,
            successful=successful,
            failed=failed,
        )
        db.session.add(log)
        db.session.commit()

        logging.info(f"Scrape finished. Total: {total_services}, OK: {successful}, Failed: {failed}")

        print("SCRAPE COMPLETE:", total_services, "services")

if __name__ == "__main__":
    run_scraper()
