import logging
from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from config import config
from database import Db
from logging_config import logging_config
from _version import __version__

log = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)
database = Db()


@app.after_request
def after_request(response):
    database.Session.remove()
    return response


@app.route('/api/bodies', methods=['GET'])
def get_bodies():
    bodies = database.get_bodies()
    return jsonify([body.to_dict() for body in bodies])


@app.route('/api/wheels', methods=['GET'])
def get_wheels():
    wheels = database.get_wheels()
    return jsonify([item.to_dict() for item in wheels])


@app.route('/api/defaults', methods=['GET'])
def get_default_wheel():
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
    app.run(host='0.0.0.0', port=port)
    log.info(f'Running rl-loadout {__version__} on port {port}')
