from dotenv import load_dotenv
from app import create_app
from db import db
from db.models import Station

STATIONS = [
    {"code": "VIC", "name": "London Victoria"},
    {"code": "LBG", "name": "London Bridge"},
    {"code": "CBE", "name": "Canterbury West"},
    {"code": "BTN", "name": "Brighton"},
]

import os
print("DEBUG ENV:", os.getenv("DATABASE_URL"))


def main():
    load_dotenv()
    app = create_app()
    with app.app_context():
        for s in STATIONS:
            existing = Station.query.filter_by(code=s["code"]).first()
            if not existing:
                station = Station(code=s["code"], name=s["name"])
                db.session.add(station)
        db.session.commit()
        print("Stations seeded")


if __name__ == "__main__":
    main()
