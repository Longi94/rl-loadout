import logging
from config import config


LOG_FORMAT = '%(asctime)s %(levelname)7s %(name)s [%(threadName)s] : %(message)s'


def logging_config():
    level = logging.ERROR
    if config.get('log', 'level') == 'DEBUG':
        level = logging.DEBUG
    elif config.get('log', 'level') == 'INFO':
        level = logging.INFO
    elif config.get('log', 'level') == 'WARNING':
        level = logging.WARNING

    log_file = None
    if config.get('log', 'file'):
        log_file = config.get('log', 'file')

    logging.basicConfig(level=level, filename=log_file, format=LOG_FORMAT)
