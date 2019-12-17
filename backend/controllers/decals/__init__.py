from flask import jsonify
from dao import DecalDao
from utils.network.exc import NotFoundException

decal_dao = DecalDao()


def get():
    decals = decal_dao.get_all()
    return jsonify([decal.to_dict() for decal in decals]), 200


def get_by_id(id: int):
    """
    :param id: ID of the item (in-game item ID).
    """
    decal = decal_dao.get(id)

    if decal is None:
        raise NotFoundException('Wheel not found')

    return jsonify(decal.to_dict()), 200
