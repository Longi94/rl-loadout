from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from utils.network.decorators import json_required_params, commit_after
from database import database
from entity import Antenna
from dao import AntennaDao
from utils.network.exc import NotFoundException

antennas_blueprint = Blueprint('antennas', __name__, url_prefix='/internal/antennas')
antenna_dao = AntennaDao()


@antennas_blueprint.route('', methods=['GET'])
def get_antennas():
    antennas = antenna_dao.get_all()
    return jsonify([item.to_dict() for item in antennas])


@antennas_blueprint.route('', methods=['POST'])
@jwt_required
@json_required_params(['name', 'icon', 'quality', 'paintable', 'model', 'stick_id'])
def add_antenna():
    antenna = Antenna()
    antenna.apply_dict(request.json)
    stick = database.get_antenna_stick(antenna.stick_id)
    if stick is None:
        raise NotFoundException('Antenna stick ID does not exist')
    antenna.stick = stick
    antenna_dao.add(antenna)
    database.commit()
    return jsonify(antenna.to_dict())


@antennas_blueprint.route('/<antenna_id>', methods=['DELETE'])
@jwt_required
@commit_after
def delete_antenna(antenna_id):
    antenna_dao.delete(antenna_id)
    return '', 200
