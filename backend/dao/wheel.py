from .dao import BaseDao
from entity import Wheel


class WheelDao(BaseDao):
    T = Wheel

    def get_default(self) -> Wheel:
        """
        :return: the default OEM wheel
        """
        session = self.Session()
        return session.query(Wheel).get(376)
