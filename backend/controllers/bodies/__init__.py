from typing import Dict, Any
from flask import jsonify, request
from config import config
from entity import Body
from dao import BodyDao
from utils.network.exc import UnauthorizedException

body_dao = BodyDao()
asset_host = config.get('assets', 'host')


def get(replay_id=None):
    api_key = request.args.get('key', None)
    if api_key is None:
        raise UnauthorizedException('API key not provided')

    if replay_id is None:
        bodies = body_dao.get_all()
    else:
        body = body_dao.get_by_replay_id(replay_id)
        bodies = [] if body is None else [body]

    bodies = list(map(lambda x: _to_body_response(x, api_key), bodies))
    return jsonify(bodies), 200


def _to_body_response(body: Body, api_key: str) -> Dict[str, Any]:
    response = {
        'replay_id': body.replay_id,
        'model': f'{asset_host}/{body.model}',
        'name': body.name,
        'paintable': body.paintable,
        'body_texture': None,
        'chassis_texture': None
    }

    if body.replay_id is not None:
        response['body_texture'] = f'/api/textures/body?key={api_key}&body_id={body.replay_id}'

        if body.chassis_base is not None:
            response['chassis_texture'] = f'/api/textures/chassis?key={api_key}&body_id={body.replay_id}'

    return response
