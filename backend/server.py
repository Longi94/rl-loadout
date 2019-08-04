import logging
from typing import List
from functools import wraps
from datetime import timedelta
from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from config import config
from database import Db, Body
from logging_config import logging_config
from auth import verify_password
from _version import __version__

log = logging.getLogger(__name__)

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = config.get('server', 'jwt_secret')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
jwt = JWTManager(app)
CORS(app)
database = Db()


def json_required_params(params: List[str]):
    """
    Checks if the provided params are provided in the json body.
    :param params:
    """

    def decorator(function):
        @wraps(function)
        def wrapper(*args, **kwargs):
            if not request.is_json:
                return jsonify({'msg': 'Missing JSON in request'}), 400
            for param in params:
                if param not in request.json or request.json[param] == '':
                    return jsonify({'msg': f'Missing {param} parameter in JSON'}), 400
            return function(*args, **kwargs)

        return wrapper

    return decorator


@app.after_request
def after_request(response):
    database.Session.remove()
    return response


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


@app.route('/api/bodies', methods=['GET'])
def get_bodies():
    bodies = database.get_bodies()
    return jsonify([body.to_dict() for body in bodies])


@app.route('/api/bodies', methods=['POST'])
@json_required_params(['name', 'icon', 'quality', 'paintable', 'blank_skin'])
@jwt_required
def add_body():
    body = Body(
        name=request.json['name'],
        icon=request.json['icon'],
        quality=request.json['quality'],
        paintable=request.json['paintable'],
        blank_skin=request.json['blank_skin'],
        model=request.json['model'],
        base_skin=request.json.get('base_skin', None),
        chassis_base=request.json.get('chassis_base', None),
        chassis_n=request.json.get('chassis_n', None)
    )

    try:
        database.add_body(body)
    except Exception as e:
        log.error('Failed to insert body', exc_info=e)
        database.Session().rollback()

    return jsonify(body.to_dict())


@app.route('/api/wheels', methods=['GET'])
def get_wheels():
    wheels = database.get_wheels()
    return jsonify([item.to_dict() for item in wheels])


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


@app.route('/api/decals', methods=['GET'])
def get_decals():
    body_id = request.args.get('body', default=None)
    if body_id is None:
        abort(400)
    decals = database.get_decals(body_id)
    return jsonify([item.to_dict() for item in decals])


@app.route('/api/toppers', methods=['GET'])
def get_toppers():
    toppers = database.get_toppers()
    return jsonify([item.to_dict() for item in toppers])


@app.route('/api/antennas', methods=['GET'])
def get_antennas():
    antennas = database.get_antennas()
    return jsonify([item.to_dict() for item in antennas])


if __name__ == '__main__':
    logging_config()
    port = int(config.get('server', 'port'))
    log.info(f'Running rl-loadout {__version__} on port {port}')
    app.run(host='0.0.0.0', port=port)
