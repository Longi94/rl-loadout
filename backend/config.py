import os
import logging
import configparser

log = logging.getLogger(__name__)

ETC_CONFIG = '/etc/rl-loadout/config.ini'
CONFIG_FILE = 'config.ini'

config = configparser.ConfigParser()

if os.path.exists(ETC_CONFIG):
    config.read(ETC_CONFIG)

if os.path.exists(CONFIG_FILE):
    config.read(CONFIG_FILE)
