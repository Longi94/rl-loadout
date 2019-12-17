import logging
import secrets
from dao import ApiKeyDao
from utils.network.exc import UnauthorizedException

log = logging.getLogger(__name__)
api_key_dao = ApiKeyDao()


def verify_api_key(apikey: str, required_scopes):
    api_key_record = api_key_dao.get_by_value(apikey)

    if api_key_record is None:
        log.info(f"Unknown API key: {apikey}")
        raise UnauthorizedException('Provided API key is invalid')

    if not api_key_record.active:
        raise UnauthorizedException('Provided API key is inactive')

    return {'sub': api_key_record.name}


def generate_api_key() -> str:
    return secrets.token_hex(16)
