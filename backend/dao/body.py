from typing import List
from .dao import BaseDao
from entity import Body


class BodyDao(BaseDao):

    def get_all(self) -> List[Body]:
        session = self.Session()
        return session.query(Body)

    def add(self, body: Body):
        self.Session().add(body)

    def get(self, body_id) -> Body:
        session = self.Session()
        return session.query(Body).get(body_id)

    def delete(self, body_id: int):
        session = self.Session()
        session.query(Body).filter(Body.id == body_id).delete()

    def get_default(self) -> Body:
        """
        :return: the default body (Octane)
        """
        session = self.Session()
        return session.query(Body).filter(Body.name == 'Octane').first()
