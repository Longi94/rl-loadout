import logging
from logging.handlers import WatchedFileHandler
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

    if log_file:
        handlers = [WatchedFileHandler(log_file)]
    else:
        handlers = [logging.StreamHandler()]

    logging.basicConfig(level=level, handlers=handlers, format=LOG_FORMAT)
