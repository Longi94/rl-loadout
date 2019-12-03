from .api import api_blueprint
from .api_keys import api_keys_blueprint
from .auth import auth_blueprint
from .bodies import bodies_blueprint
from .wheels import wheels_blueprint
from .toppers import toppers_blueprint
from .decals import decals_blueprint
from .antenna_sticks import antenna_sticks_blueprint
from .antennas import antennas_blueprint
from .product import products_blueprint

blueprints = [
    api_blueprint,
    api_keys_blueprint,
    auth_blueprint,
    bodies_blueprint,
    wheels_blueprint,
    toppers_blueprint,
    decals_blueprint,
    antennas_blueprint,
    antenna_sticks_blueprint,
    products_blueprint
]
