from flask import Blueprint, jsonify, request
from dao import BodyDao, WheelDao, TopperDao, AntennaDao, DecalDao
from _version import __version__

api_blueprint = Blueprint('main_api', __name__, url_prefix='/internal')
body_dao = BodyDao()
wheel_dao = WheelDao()
topper_dao = TopperDao()
antenna_dao = AntennaDao()
decal_dao = DecalDao()


@api_blueprint.route('/status', methods=['GET'])
def status():
    return jsonify({
        'version': __version__
    })


@api_blueprint.route('/defaults', methods=['GET'])
def get_defaults():
    result = {}

    body = body_dao.get_default()
    if body is not None:
        result['body'] = body.to_dict()

    wheel = wheel_dao.get_default()
    if wheel is not None:
        result['wheel'] = wheel.to_dict()

    return jsonify(result)


@api_blueprint.route('/all', methods=['GET'])
def get_all():
    result = {
        'bodies': [item.to_dict() for item in body_dao.get_all()],
        'wheels': [item.to_dict() for item in wheel_dao.get_all()],
        'toppers': [item.to_dict() for item in topper_dao.get_all()],
        'antennas': [item.to_dict() for item in antenna_dao.get_all()]
    }

    body_id = request.args.get('body', default=None)

    if body_id is not None:
        result['decals'] = [item.to_dict() for item in decal_dao.get_all(body_id)]

    return jsonify(result)
