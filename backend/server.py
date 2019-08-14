import logging
from datetime import timedelta
from flask import jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token
import connexion
from utils.network.decorators import commit_after, json_required_params
from utils.network import log_endpoints
from config import config
from database import database, Antenna, AntennaStick
from logging_config import logging_config
from auth import verify_password
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


@app.route('/api/status', methods=['GET'])
def status():
    return jsonify({
        'version': __version__
    })


@app.route('/auth', methods=['POST'])
@json_required_params(['username', 'password'])
def auth():
    username = request.json['username']
    password = request.json['password']

    user = database.get_user(username)

    if user is None:
        return jsonify({"msg": "User does not exist"}), 404

    if not verify_password(user.password, password):
        return jsonify({"msg": "Bad username or password"}), 401

    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token), 200


@app.route('/api/all', methods=['GET'])
def get_all():
    result = {
        'bodies': [item.to_dict() for item in database.get_bodies()],
        'wheels': [item.to_dict() for item in database.get_wheels()],
        'toppers': [item.to_dict() for item in database.get_toppers()],
        'antennas': [item.to_dict() for item in database.get_antennas()]
    }

    body_id = request.args.get('body', default=None)

    if body_id is not None:
        result['decals'] = [item.to_dict() for item in database.get_decals(body_id)]

    return jsonify(result)


@app.route('/api/defaults', methods=['GET'])
def get_defaults():
    result = {}

    body = database.get_default_body()
    if body is not None:
        result['body'] = body.to_dict()

    wheel = database.get_default_wheel()
    if wheel is not None:
        result['wheel'] = wheel.to_dict()

    return jsonify(result)


@app.route('/api/antennas', methods=['GET'])
def get_antennas():
    antennas = database.get_antennas()
    return jsonify([item.to_dict() for item in antennas])


@app.route('/api/antennas', methods=['POST'])
@jwt_required
@json_required_params(['name', 'icon', 'quality', 'paintable', 'model', 'stick_id'])
def add_antenna():
    antenna = Antenna()
    antenna.apply_dict(request.json)
    stick = database.get_antenna_stick(antenna.stick_id)
    if stick is None:
        return jsonify({'msg': 'Stick ID does not exist'}), 400
    antenna.stick = stick
    database.add_antenna(antenna)
    database.commit()
    return jsonify(antenna.to_dict())


@app.route('/api/antennas/<antenna_id>', methods=['DELETE'])
@jwt_required
@commit_after
def delete_antenna(antenna_id):
    database.delete_antenna(antenna_id)
    return '', 200


@app.route('/api/antenna-sticks', methods=['GET'])
def get_antenna_sticks():
    antenna_sticks = database.get_antenna_sticks()
    return jsonify([item.to_dict() for item in antenna_sticks])


@app.route('/api/antenna-sticks', methods=['POST'])
@jwt_required
@json_required_params(['model'])
def add_antenna_stick():
    antenna_stick = AntennaStick()
    antenna_stick.apply_dict(request.json)
    database.add_antenna_stick(antenna_stick)
    database.commit()
    return jsonify(antenna_stick.to_dict())


@app.route('/api/antenna-sticks/<antenna_stick_id>', methods=['DELETE'])
@jwt_required
@commit_after
def delete_antenna_stick(antenna_stick_id):
    database.delete_antenna_stick(antenna_stick_id)
    return '', 200


if __name__ == '__main__':
    logging_config()
    port = int(config.get('server', 'port'))
    log.info(f'Running rl-loadout {__version__} on port {port}')
    log_endpoints(log, app)
    app.run(host='0.0.0.0', port=port)
