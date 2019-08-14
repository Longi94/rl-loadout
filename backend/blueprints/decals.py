from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from utils.network.decorators import json_required_params, commit_after
from database import database
from entity import Decal
from dao import DecalDao, BodyDao

decals_blueprint = Blueprint('decals', __name__, url_prefix='/api/decals')
decal_dao = DecalDao()
body_dao = BodyDao()


@decals_blueprint.route('', methods=['GET'])
def get_decals():
    body_id = request.args.get('body', default=None)
    decals = decal_dao.get_all(body_id)
    return jsonify([item.to_dict() for item in decals])


@decals_blueprint.route('', methods=['POST'])
@jwt_required
@json_required_params(['rgba_map', 'decal_detail_id'])
def add_decal():
    decal = Decal()
    decal.apply_dict(request.json)

    detail = database.get_decal_detail(decal.decal_detail_id)
    if detail is None:
        return jsonify({'msg': 'Decal detail ID does not exist'}), 400

    if decal.body_id:
        body = body_dao.get(decal.body_id)
        if body is not None:
            decal.body = body

    decal.decal_detail = detail
    decal_dao.add(decal)
    database.commit()
    return jsonify(decal.to_dict())


@decals_blueprint.route('/<decal_id>', methods=['DELETE'])
@jwt_required
@commit_after
def delete_decal(decal_id):
    decal_dao.delete(decal_id)
    return '', 200
