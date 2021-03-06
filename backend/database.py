import logging
from sqlalchemy import create_engine
from sqlalchemy.engine.url import URL
from sqlalchemy.orm import sessionmaker, scoped_session
from config import config
from entity import Base

log = logging.getLogger(__name__)


class Db(object):
    def __init__(self):
        self.url = URL(
            drivername=config.get('database', 'driver'),
            username=config.get('database', 'username'),
            password=config.get('database', 'password'),
            host=config.get('database', 'host'),
            port=int(config.get('database', 'port')),
            database=config.get('database', 'database')
        )

        self.engine = create_engine(self.url)

        if config.get('database', 'create_all').lower() == 'true':
            Base.metadata.create_all(self.engine)

        self.Session = scoped_session(sessionmaker(bind=self.engine))

    def commit(self):
        self.Session().commit()


database = Db()
