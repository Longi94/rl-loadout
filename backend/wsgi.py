import logging
from server import app, logging_config
from utils.network import log_endpoints
from _version import __version__

log = logging.getLogger(__name__)

logging_config()
log.info(f'Running rl-loadout {__version__} with wsgi using socket file')
log_endpoints(log, app)

if __name__ == '__main__':
    app.run()
