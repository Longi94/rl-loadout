from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from config import config
from database import Db
from logging_config import logging_config

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


@app.route('/api/decals', methods=['GET'])
def get_decals():
    body_id = request.args.get('body', default=None)
    if body_id is None:
        abort(400)
    decals = database.get_decals(body_id)
    return jsonify([item.to_dict() for item in decals])


if __name__ == '__main__':
    logging_config()
    port = int(config.get('server', 'port'))
    app.run(host='0.0.0.0', port=port)
