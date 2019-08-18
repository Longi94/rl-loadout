import logging
from datetime import timedelta
from flask import jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from werkzeug.exceptions import HTTPException, default_exceptions
import connexion
from utils.network import log_endpoints
from utils.network.exc import HttpException
from config import config
from database import database
from logging_config import logging_config
from blueprints import blueprints
from _version import __version__

log = logging.getLogger(__name__)

connexion_app = connexion.App(__name__, arguments={
    'server_host': config.get('server', 'host'),
    'version': __version__
})
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


@app.errorhandler(HttpException)
def handle_http_exception(e: HttpException):
    return jsonify({
        'status': e.code,
        'detail': e.message
    }), e.code


@app.errorhandler(Exception)
def handle_error(e):
    code = 500
    if isinstance(e, HTTPException):
        code = e.code
    return jsonify({
        'status': code,
        'detail': str(e)
    }), code


if __name__ == '__main__':
    logging_config()
    port = int(config.get('server', 'port'))
    log.info(f'Running rl-loadout {__version__} on port {port}')
    log_endpoints(log, app)

    for ex in default_exceptions:
        app.register_error_handler(ex, handle_error)

    connexion_app.run(host='0.0.0.0', port=port)
