from flask import jsonify
from dao import WheelDao
from utils.network.exc import NotFoundException

wheel_dao = WheelDao()


def get():
    wheels = wheel_dao.get_all()
    return jsonify([wheel.to_dict() for wheel in wheels]), 200


def get_by_id(id: int):
    """
    :param id: ID of the item (in-game item ID).
    """
    wheel = wheel_dao.get(id)

    if wheel is None:
        raise NotFoundException('Wheel not found')

    return jsonify(wheel.to_dict()), 200
