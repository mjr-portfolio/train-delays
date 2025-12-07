from flask import Flask
from dotenv import load_dotenv
load_dotenv()

from config import get_config
from db import init_app as init_db
from db import models  # noqa: F401  # ensure models are registered
from routes import health_bp, stations_bp, services_bp


def create_app():
    load_dotenv()
    app = Flask(__name__)
    app_config = get_config()
    app.config.from_object(app_config)

    print("DEBUG DB URI:", app.config.get("SQLALCHEMY_DATABASE_URI"))

    # Initialise DB + migrations
    init_db(app)

    # Register blueprints
    app.register_blueprint(health_bp)
    app.register_blueprint(stations_bp)
    app.register_blueprint(services_bp)

    @app.get("/")
    def index():
        return {"message": "Train delays backend running"}

    return app
