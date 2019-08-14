from typing import List
from .dao import BaseDao
from entity import Wheel


class WheelDao(BaseDao):

    def get_all(self) -> List[Wheel]:
        session = self.Session()
        return session.query(Wheel)

    def delete(self, wheel_id: int):
        session = self.Session()
        session.query(Wheel).filter(Wheel.id == wheel_id).delete()

    def add(self, wheel: Wheel):
        self.Session().add(wheel)

    def get_default(self) -> Wheel:
        """
        :return: the default OEM wheel
        """
        session = self.Session()
        return session.query(Wheel).filter(Wheel.name == 'OEM').first()
