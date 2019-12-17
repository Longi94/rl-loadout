from entity import User
from .dao import BaseDao


class UserDao(BaseDao):
    T = User

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

    def get_by_username(self, username: str):
        """
        Find user by username
        :param username: username
        :return:
        """
        session = self.Session()
        username = username.lower()
        return session.query(User).filter(User.name == username).first()
