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


@api_blueprint.route('/all', methods=['GET'])
def get_all():
    result = {
        'bodies': [item.Body.product_joined_to_dict(item.Product) for item in body_dao.get_all_join_product()],
        'wheels': [item.Wheel.product_joined_to_dict(item.Product) for item in wheel_dao.get_all_join_product()],
        'toppers': [item.Topper.product_joined_to_dict(item.Product) for item in topper_dao.get_all_join_product()],
        'antennas': [item.Antenna.product_joined_to_dict(item.Product) for item in antenna_dao.get_all_join_product()]
    }

    body_id = request.args.get('body', default=None)

    if body_id is not None:
        result['decals'] = [item.Decal.product_joined_to_dict(item.Product) for item in decal_dao.get_all_for_body(body_id)]

    return jsonify(result)
