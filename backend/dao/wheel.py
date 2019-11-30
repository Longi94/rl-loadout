from .item import BaseItemDao
from entity import Wheel


class WheelDao(BaseItemDao):
    T = Wheel

    def get_default(self) -> Wheel:
        """
        :return: the default OEM wheel
        """
        session = self.Session()
        return session.query(Wheel).get(376)
