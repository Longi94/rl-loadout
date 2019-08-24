from .dao import BaseDao
from entity import Body


class BodyDao(BaseDao):
    T = Body

    def get_default(self) -> Body:
        """
        :return: the default body (Octane)
        """
        session = self.Session()
        return session.query(Body).filter(Body.name == 'Octane').first()
