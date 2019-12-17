from flask import jsonify
from dao import TopperDao
from utils.network.exc import NotFoundException

topper_dao = TopperDao()


def get():
    toppers = topper_dao.get_all()
    return jsonify([topper.to_dict() for topper in toppers]), 200


def get_by_id(id: int):
    """
    :param id: ID of the item (in-game item ID).
    """
    topper = topper_dao.get(id)

    if topper is None:
        raise NotFoundException('Wheel not found')

    return jsonify(topper.to_dict()), 200
