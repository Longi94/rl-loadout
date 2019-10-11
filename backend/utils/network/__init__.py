from config import config


def log_endpoints(log, app):
    log.info(f'Registered {len(list(app.url_map.iter_rules()))} endpoints:')
    for rule in app.url_map.iter_rules():
        log.info(f'[{rule.methods}] {rule.rule} -> {rule.endpoint}')


def get_asset_url(path: str) -> str or None:
    if path is None:
        return None

    return f'{config.get("assets", "host")}/{path}'
