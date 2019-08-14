from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from utils.network.decorators import json_required_params, commit_after
from database import database
from entity import ApiKey
from dao import ApiKeyDao
from api.api import generate_api_key

api_keys_blueprint = Blueprint('api_keys', __name__, url_prefix='/api/api-keys')
key_dao = ApiKeyDao()


@api_keys_blueprint.route('', methods=['GET'])
@jwt_required
def get():
    keys = key_dao.get_all()
    return jsonify([item.to_dict() for item in keys])


@api_keys_blueprint.route('', methods=['POST'])
@jwt_required
@json_required_params(['name', 'description', 'active'])
def add():
    key = ApiKey()
    key.apply_dict(request.json)
    key.key = generate_api_key()
    key_dao.add(key)
    database.commit()
    return jsonify(key.to_dict())


@api_keys_blueprint.route('/<key_id>', methods=['DELETE'])
@jwt_required
@commit_after
def delete_body(key_id):
    key_dao.delete(key_id)
    return '', 200
