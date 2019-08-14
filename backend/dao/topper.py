from typing import List
from .dao import BaseDao
from entity import Topper


class TopperDao(BaseDao):

    def get_all(self) -> List[Topper]:
        session = self.Session()
        return session.query(Topper)

    def delete(self, topper_id: int):
        session = self.Session()
        session.query(Topper).filter(Topper.id == topper_id).delete()

    def add(self, topper: Topper):
        self.Session().add(topper)
