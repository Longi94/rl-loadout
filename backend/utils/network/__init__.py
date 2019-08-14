def log_endpoints(log, app):
    log.info(f'Registered {len(list(app.url_map.iter_rules()))} endpoints:')
    for rule in app.url_map.iter_rules():
        log.info(f'[{rule.methods}] {rule.rule} -> {rule.endpoint}')
