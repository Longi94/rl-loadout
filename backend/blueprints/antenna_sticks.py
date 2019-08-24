from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from utils.network.decorators import json_required_params, commit_after
from database import database
from entity import AntennaStick
from dao import AntennaDao
from utils.network.exc import NotFoundException

antenna_sticks_blueprint = Blueprint('antenna_sticks', __name__, url_prefix='/internal/antenna-sticks')
antenna_dao = AntennaDao()


@antenna_sticks_blueprint.route('', methods=['GET'])
def get_antenna_sticks():
    antenna_sticks = antenna_dao.get_sticks()
    return jsonify([item.to_dict() for item in antenna_sticks])


@antenna_sticks_blueprint.route('', methods=['POST'])
@jwt_required
@json_required_params(['model'])
def add_antenna_stick():
    antenna_stick = AntennaStick()
    antenna_stick.apply_dict(request.json)
    antenna_dao.add_stick(antenna_stick)
    database.commit()
    return jsonify(antenna_stick.to_dict())


@antenna_sticks_blueprint.route('/<antenna_stick_id>', methods=['DELETE'])
@jwt_required
@commit_after
def delete_antenna_stick(antenna_stick_id):
    antenna_dao.delete_stick(antenna_stick_id)
    return '', 200


@antenna_sticks_blueprint.route('/<antenna_stick_id>', methods=['PUT'])
@jwt_required
@commit_after
def update_antenna_stick(antenna_stick_id):
    item = antenna_dao.get_stick(antenna_stick_id)

    if item is None:
        raise NotFoundException('Antenna stick not found')

    item.update(request.json)
    return '', 200
