from flask import Flask

# Load environment variables early so the database URI and API keys
# are available before extensions (SQLAlchemy, CORS) initialise.
from dotenv import load_dotenv
load_dotenv()

from config import get_config
from db import init_app as init_db
from db import models  # noqa: F401  # ensure models are registered
from routes import health_bp, stations_bp, services_bp
from flask_cors import CORS

# App factory for the backend API.
# Using a factory makes it easier for workers, tests, and CLI commands
# to import the app cleanly.

def create_app():
    """Create and configure the Flask application."""
    
    app = Flask(__name__)
    app_config = get_config()
    app.config.from_object(app_config)

    CORS(app)

    # Initialise DB + models
    init_db(app)

    # Register API blueprints
    app.register_blueprint(health_bp)
    app.register_blueprint(stations_bp)
    app.register_blueprint(services_bp)

    @app.get("/")
    def index():
        return {"message": "Train delays backend running"}

    return app
