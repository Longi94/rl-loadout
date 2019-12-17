from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token
from dao import UserDao
from auth import verify_password
from utils.network.decorators import json_required_params
from utils.network.exc import UnauthorizedException

auth_blueprint = Blueprint('auth', __name__,)
user_dao = UserDao()


@auth_blueprint.route('/auth', methods=['POST'])
@json_required_params(['username', 'password'])
def auth():
    username = request.json['username']
    password = request.json['password']

    user = user_dao.get_by_username(username)

    if user is None:
        raise UnauthorizedException('Bad username or password')

    if not verify_password(user.password, password):
        raise UnauthorizedException('Bad username or password')

    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token), 200
