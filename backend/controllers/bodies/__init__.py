from flask import jsonify
from config import config
from dao import BodyDao
from utils.network.exc import NotFoundException

body_dao = BodyDao()
asset_host = config.get('assets', 'host')


def get():
    bodies = body_dao.get_all()
    return jsonify([body.to_dict() for body in bodies]), 200


def get_by_id(id: int):
    """
    :param id: ID of the item (in-game item ID).
    """
    body = body_dao.get(id)

    if body is None:
        raise NotFoundException('Body not found')

    return jsonify(body.to_dict()), 200
