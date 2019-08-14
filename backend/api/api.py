import logging
import secrets
from dao import ApiKeyDao

log = logging.getLogger(__name__)
api_key_dao = ApiKeyDao()


def verify_api_key(apikey: str, required_scopes):
    api_key_record = api_key_dao.get_by_value(apikey)

    if api_key_record is None:
        log.info(f"Unknown API key: {apikey}")
        return None

    return {'sub': api_key_record.name}


def generate_api_key() -> str:
    return secrets.token_hex(16)
