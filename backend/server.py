import logging
from typing import List
from functools import wraps
from datetime import timedelta
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token
from config import config
from database import Db, Body, Wheel, Topper, Antenna, AntennaStick, Decal, DecalDetail
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


@app.teardown_request
def teardown_request(exception):
    if exception:
        database.Session.rollback()
    database.Session.remove()


def commit_after(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        response = function(*args, **kwargs)
        if database.Session.is_active:
            try:
                database.Session.commit()
            except Exception as e:
                log.error('exception occured during commit', exc_info=e)
                database.Session.rollback()
                return jsonify({'msg': 'Database exception occurred, check the logs'}), 500
        return response

    return wrapper


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
@jwt_required
@json_required_params(['name', 'icon', 'quality', 'paintable', 'model', 'blank_skin'])
@commit_after
def add_body():
    body = Body()
    body.apply_dict(request.json)
    database.add_body(body)
    return jsonify(body.to_dict())


@app.route('/api/bodies/<body_id>', methods=['DELETE'])
@jwt_required
@commit_after
def delete_body(body_id):
    database.delete_body(body_id)
    return '', 200


@app.route('/api/wheels', methods=['GET'])
def get_wheels():
    wheels = database.get_wheels()
    return jsonify([item.to_dict() for item in wheels])


@app.route('/api/wheels', methods=['POST'])
@jwt_required
@json_required_params(['name', 'icon', 'quality', 'paintable', 'model'])
@commit_after
def add_wheel():
    wheel = Wheel()
    wheel.apply_dict(request.json)
    database.add_wheel(wheel)
    return jsonify(wheel.to_dict())


@app.route('/api/wheels/<wheel_id>', methods=['DELETE'])
@jwt_required
@commit_after
def delete_wheel(wheel_id):
    database.delete_wheel(wheel_id)
    return '', 200


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
    decals = database.get_decals(body_id)
    return jsonify([item.to_dict() for item in decals])


@app.route('/api/decals', methods=['POST'])
@jwt_required
@json_required_params(['rgba_map', 'decal_detail_id'])
@commit_after
def add_decal():
    decal = Decal()
    decal.apply_dict(request.json)
    database.add_decal(decal)
    return jsonify(decal.to_dict())


@app.route('/api/decals/<decal_id>', methods=['DELETE'])
@jwt_required
@commit_after
def delete_decal(decal_id):
    database.delete_decal(decal_id)
    return '', 200


@app.route('/api/decal-details', methods=['GET'])
def get_decal_details():
    decal_details = database.get_decal_details()
    return jsonify([item.to_dict() for item in decal_details])


@app.route('/api/decal-details', methods=['POST'])
@jwt_required
@json_required_params(['name', 'icon', 'quality', 'paintable'])
@commit_after
def add_decal_detail():
    decal_detail = DecalDetail()
    decal_detail.apply_dict(request.json)
    database.add_decal_detail(decal_detail)
    return jsonify(decal_detail.to_dict())


@app.route('/api/decal-details/<decal_detail_id>', methods=['DELETE'])
@jwt_required
@commit_after
def delete_decal_detail(decal_detail_id):
    database.delete_decal_detail(decal_detail_id)
    return '', 200


@app.route('/api/toppers', methods=['GET'])
def get_toppers():
    toppers = database.get_toppers()
    return jsonify([item.to_dict() for item in toppers])


@app.route('/api/toppers', methods=['POST'])
@jwt_required
@json_required_params(['name', 'icon', 'quality', 'paintable', 'model'])
@commit_after
def add_topper():
    topper = Topper()
    topper.apply_dict(request.json)
    database.add_topper(topper)
    return jsonify(topper.to_dict())


@app.route('/api/toppers/<topper_id>', methods=['DELETE'])
@jwt_required
@commit_after
def delete_topper(topper_id):
    database.delete_topper(topper_id)
    return '', 200


@app.route('/api/antennas', methods=['GET'])
def get_antennas():
    antennas = database.get_antennas()
    return jsonify([item.to_dict() for item in antennas])


@app.route('/api/antennas', methods=['POST'])
@jwt_required
@json_required_params(['name', 'icon', 'quality', 'paintable', 'model', 'stick_id'])
@commit_after
def add_antenna():
    antenna = Antenna()
    antenna.apply_dict(request.json)
    database.add_antenna(antenna)
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
@commit_after
def add_antenna_stick():
    antenna_stick = AntennaStick()
    antenna_stick.apply_dict(request.json)
    database.add_antenna_stick(antenna_stick)
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
    app.run(host='0.0.0.0', port=port)
