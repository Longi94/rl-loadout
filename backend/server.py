import logging
from datetime import timedelta
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import connexion
from utils.network import log_endpoints
from config import config
from database import database
from logging_config import logging_config
from blueprints import blueprints
from _version import __version__

log = logging.getLogger(__name__)

connexion_app = connexion.App(__name__)
connexion_app.add_api('api_swagger.yml')
app = connexion_app.app

for blueprint in blueprints:
    app.register_blueprint(blueprint)

app.config['JWT_SECRET_KEY'] = config.get('server', 'jwt_secret')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
jwt = JWTManager(app)
CORS(app)


@app.teardown_request
def teardown_request(exception):
    if exception:
        database.Session.rollback()
    database.Session.remove()


if __name__ == '__main__':
    logging_config()
    port = int(config.get('server', 'port'))
    log.info(f'Running rl-loadout {__version__} on port {port}')
    log_endpoints(log, app)
    connexion_app.run(host='0.0.0.0', port=port)
