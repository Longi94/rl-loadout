from typing import Dict, Any
from flask import jsonify, request
from config import config
from entity import Body
from dao import BodyDao
from utils.network.exc import UnauthorizedException, NotFoundException
from rocket.ids import *

body_dao = BodyDao()
asset_host = config.get('assets', 'host')


def get(id=None):
    api_key = request.args.get('key', None)
    if api_key is None:
        raise UnauthorizedException('API key not provided')

    bodies = body_dao.get_all()

    bodies = list(map(lambda x: _to_body_response(x, api_key), bodies))
    return jsonify(bodies), 200


def get_by_id(id: int):
    """
    :param id: ID of the item (in-game item ID).
    """
    api_key = request.args.get('key', None)
    if api_key is None:
        raise UnauthorizedException('API key not provided')

    body = body_dao.get(id)

    if body is None:
        raise NotFoundException('Body not found')

    return jsonify(_to_body_response(body, api_key)), 200


def _to_body_response(body: Body, api_key: str) -> Dict[str, Any]:
    response = {
        'id': body.id,
        'model': f'{asset_host}/{body.model}',
        'name': body.name,
        'paintable': body.paintable,
        'body_texture': f'/api/textures/body?key={api_key}&body_id={body.id}',
        'chassis_texture': None
    }

    if body.chassis_base is not None:
        response['chassis_texture'] = f'/api/textures/chassis?key={api_key}&body_id={body.id}'

    if body.id == BODY_MAPLE_ID:
        response['chassis_texture'] = f'/api/textures/chassis?key={api_key}&body_id={body.id}'

    return response
