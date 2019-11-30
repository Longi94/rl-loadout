from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from utils.network.decorators import json_required_params, commit_after
from database import database
from entity import Decal
from dao import DecalDao, BodyDao
from utils.network.exc import NotFoundException

decals_blueprint = Blueprint('decals', __name__, url_prefix='/internal/decals')
decal_dao = DecalDao()
body_dao = BodyDao()


@decals_blueprint.route('', methods=['GET'])
def get_decals():
    body_id = request.args.get('body', default=None)
    decals = decal_dao.get_all_for_body(body_id)
    return jsonify([item.Decal.product_joined_to_dict(item.Product) for item in decals])


@decals_blueprint.route('', methods=['POST'])
@jwt_required
@json_required_params(['icon', 'quality', 'paintable', 'id', 'rgba_map'])
def add_decal():
    decal = Decal()
    decal.apply_dict(request.json)

    if decal.body_id:
        body = body_dao.get(decal.body_id)
        if body is not None:
            decal.body = body

    decal_dao.add(decal)
    database.commit()
    return jsonify(decal.to_dict())


@decals_blueprint.route('/<decal_id>', methods=['DELETE'])
@jwt_required
@commit_after
def delete_decal(decal_id):
    decal_dao.delete(decal_id)
    return '', 200


@decals_blueprint.route('/<decal_id>', methods=['PUT'])
@jwt_required
@commit_after
def update(decal_id):
    item = decal_dao.get(decal_id)

    if item is None:
        raise NotFoundException('Decal not found')

    item.update(request.json)
    return '', 200
