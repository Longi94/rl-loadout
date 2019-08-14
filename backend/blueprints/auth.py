from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token
from dao import UserDao
from auth import verify_password
from utils.network.decorators import json_required_params

auth_blueprint = Blueprint('auth', __name__, url_prefix='/api')
user_dao = UserDao()


@auth_blueprint.route('/auth', methods=['POST'])
@json_required_params(['username', 'password'])
def auth():
    username = request.json['username']
    password = request.json['password']

    user = user_dao.get(username)

    if user is None:
        return jsonify({"msg": "User does not exist"}), 404

    if not verify_password(user.password, password):
        return jsonify({"msg": "Bad username or password"}), 401

    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token), 200
