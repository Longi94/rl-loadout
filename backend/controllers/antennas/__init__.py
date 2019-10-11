from flask import jsonify
from dao import AntennaDao
from utils.network.exc import NotFoundException

antenna_dao = AntennaDao()


def get():
    antennas = antenna_dao.get_all()
    return jsonify([antenna.to_dict() for antenna in antennas]), 200


def get_by_id(id: int):
    """
    :param id: ID of the item (in-game item ID).
    """
    antenna = antenna_dao.get(id)

    if antenna is None:
        raise NotFoundException('Wheel not found')

    return jsonify(antenna.to_dict()), 200
