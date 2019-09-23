from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from utils.network.decorators import json_required_params, commit_after
from database import database
from entity import Wheel
from dao import WheelDao
from utils.network.exc import NotFoundException

wheels_blueprint = Blueprint('wheels', __name__, url_prefix='/internal/wheels')
wheel_dao = WheelDao()


@wheels_blueprint.route('', methods=['GET'])
def get_wheels():
    wheels = wheel_dao.get_all()
    return jsonify([item.to_dict() for item in wheels])


@wheels_blueprint.route('', methods=['POST'])
@jwt_required
@json_required_params(['id', 'name', 'icon', 'quality', 'paintable', 'model'])
def add_wheel():
    wheel = Wheel()
    wheel.apply_dict(request.json)
    wheel_dao.add(wheel)
    database.commit()
    return jsonify(wheel.to_dict())


@wheels_blueprint.route('/<wheel_id>', methods=['DELETE'])
@jwt_required
@commit_after
def delete_wheel(wheel_id):
    wheel_dao.delete(wheel_id)
    return '', 200


@wheels_blueprint.route('/<wheel_id>', methods=['PUT'])
@jwt_required
@commit_after
def update(wheel_id):
    item = wheel_dao.get(wheel_id)

    if item is None:
        raise NotFoundException('Wheel not found')

    item.update(request.json)
    return '', 200
