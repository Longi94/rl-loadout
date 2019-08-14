import logging
from sqlalchemy import create_engine
from sqlalchemy.engine.url import URL
from sqlalchemy.orm import sessionmaker, scoped_session
from config import config
from entity import *

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

    def add_user(self, username: str, password: str):
        """
        Add a user to the db
        :param username:
        :param password:
        """
        session = self.Session()
        user = User(name=username.lower(), password=password)
        session.add(user)
        session.commit()

    def get_user(self, username: str):
        """
        Find user by username
        :param username: username
        :return:
        """
        session = self.Session()
        username = username.lower()
        return session.query(User).filter(User.name == username).first()


database = Db()
