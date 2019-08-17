from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from utils.network.decorators import json_required_params, commit_after
from database import database
from entity import DecalDetail
from dao import DecalDao

decal_details_blueprint = Blueprint('decal_details', __name__, url_prefix='/internal/decal-details')
decal_dao = DecalDao()


@decal_details_blueprint.route('', methods=['GET'])
def get_decal_details():
    decal_details = decal_dao.get_all_details()
    return jsonify([item.to_dict() for item in decal_details])


@decal_details_blueprint.route('', methods=['POST'])
@jwt_required
@json_required_params(['name', 'icon', 'quality', 'paintable'])
def add_decal_detail():
    decal_detail = DecalDetail()
    decal_detail.apply_dict(request.json)
    decal_dao.add_detail(decal_detail)
    database.commit()
    return jsonify(decal_detail.to_dict())


@decal_details_blueprint.route('/<decal_detail_id>', methods=['DELETE'])
@jwt_required
@commit_after
def delete_decal_detail(decal_detail_id):
    decal_dao.delete_detail(decal_detail_id)
    return '', 200
