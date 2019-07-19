import os
import logging
import configparser

log = logging.getLogger(__name__)

CONFIG_FILE = 'config.ini'

config = configparser.ConfigParser()

if os.path.exists(CONFIG_FILE):
    config.read(CONFIG_FILE)
else:
    log.warn('Config file not found, using defaults.')
