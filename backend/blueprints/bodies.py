from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from utils.network.decorators import json_required_params, commit_after
from database import database
from entity import Body
from dao import BodyDao
from utils.network.exc import NotFoundException

bodies_blueprint = Blueprint('bodies', __name__, url_prefix='/internal/bodies')
body_dao = BodyDao()


@bodies_blueprint.route('', methods=['GET'])
def get_bodies():
    bodies = body_dao.get_all()
    return jsonify([body.to_dict() for body in bodies])


@bodies_blueprint.route('', methods=['POST'])
@jwt_required
@json_required_params(['name', 'icon', 'quality', 'paintable', 'model'])
def add_body():
    body = Body()
    body.apply_dict(request.json)
    body_dao.add(body)
    database.commit()
    return jsonify(body.to_dict())


@bodies_blueprint.route('/<body_id>', methods=['DELETE'])
@jwt_required
@commit_after
def delete_body(body_id):
    body_dao.delete(body_id)
    return '', 200


@bodies_blueprint.route('/<body_id>', methods=['PUT'])
@jwt_required
@commit_after
def update_body(body_id):
    item = body_dao.get(body_id)

    if item is None:
        raise NotFoundException('Body not found')

    item.update(request.json)
    return '', 200
