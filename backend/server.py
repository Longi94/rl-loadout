import logging
from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from config import config
from database import Db
from logging_config import logging_config
from auth import verify_password
from _version import __version__

log = logging.getLogger(__name__)

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = config.get('server', 'jwt_secret')
jwt = JWTManager(app)
CORS(app)
database = Db()


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
def auth():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    username = request.json.get('username', None)
    password = request.json.get('password', None)
    if not username:
        return jsonify({"msg": "Missing username parameter"}), 400
    if not password:
        return jsonify({"msg": "Missing password parameter"}), 400

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
