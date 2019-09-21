from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from utils.network.decorators import json_required_params, commit_after
from database import database
from entity import Topper
from dao import TopperDao
from utils.network.exc import NotFoundException

toppers_blueprint = Blueprint('toppers', __name__, url_prefix='/internal/toppers')
topper_dao = TopperDao()


@toppers_blueprint.route('', methods=['GET'])
def get_toppers():
    toppers = topper_dao.get_all()
    return jsonify([item.to_dict() for item in toppers])


@toppers_blueprint.route('', methods=['POST'])
@jwt_required
@json_required_params(['id', 'name', 'icon', 'quality', 'paintable', 'model'])
def add_topper():
    topper = Topper()
    topper.apply_dict(request.json)
    topper_dao.add(topper)
    database.commit()
    return jsonify(topper.to_dict())


@toppers_blueprint.route('/<topper_id>', methods=['DELETE'])
@jwt_required
@commit_after
def delete_topper(topper_id):
    topper_dao.delete(topper_id)
    return '', 200


@toppers_blueprint.route('/<topper_id>', methods=['PUT'])
@jwt_required
@commit_after
def update(topper_id):
    item = topper_dao.get(topper_id)

    if item is None:
        raise NotFoundException('Topper not found')

    item.update(request.json)
    return '', 200
