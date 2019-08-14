import logging
from typing import List
from functools import wraps
from flask import request, jsonify
from database import database

log = logging.getLogger(__name__)


def json_required_params(params: List[str]):
    """
    Checks if the provided params are provided in the json body.
    :param params:
    """

    def decorator(function):
        @wraps(function)
        def wrapper(*args, **kwargs):
            if not request.is_json:
                return jsonify({'msg': 'Missing JSON in request'}), 400
            for param in params:
                if param not in request.json or request.json[param] == '':
                    return jsonify({'msg': f'Missing {param} parameter in JSON'}), 400
            return function(*args, **kwargs)

        return wrapper

    return decorator


def commit_after(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        response = function(*args, **kwargs)
        if database.Session.is_active:
            try:
                database.Session.commit()
            except Exception as e:
                log.error('exception occured during commit', exc_info=e)
                database.Session.rollback()
                return jsonify({'msg': 'Database exception occurred, check the logs'}), 500
        return response

    return wrapper
