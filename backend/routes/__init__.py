from flask import Blueprint

health_bp = Blueprint("health", __name__)
stations_bp = Blueprint("stations", __name__)
services_bp = Blueprint("services", __name__)

from . import health  # noqa: E402,F401
from . import stations # noqa
from . import services # noqa
