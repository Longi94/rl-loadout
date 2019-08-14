import logging
from typing import List
from functools import wraps
from flask import request
from database import database
from utils.network.exc import BadRequestException, InternalServerErrorException

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
                raise BadRequestException('Missing JSON in request')
            for param in params:
                if param not in request.json or request.json[param] == '':
                    raise BadRequestException(f'Missing {param} parameter in JSON')
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
                log.error('exception occurred during commit', exc_info=e)
                database.Session.rollback()
                raise InternalServerErrorException('Database exception occurred, check the logs')
        return response

    return wrapper
