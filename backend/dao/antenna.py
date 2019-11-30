from typing import List
from .item import BaseItemDao
from entity import Antenna, AntennaStick


class AntennaDao(BaseItemDao):
    T = Antenna

    def get_sticks(self) -> List[AntennaStick]:
        session = self.Session()
        return session.query(AntennaStick)

    def get_stick(self, stick_id) -> AntennaStick:
        session = self.Session()
        return session.query(AntennaStick).get(stick_id)

    def delete_stick(self, antenna_stick_id: int):
        session = self.Session()
        session.query(AntennaStick).filter(AntennaStick.id == antenna_stick_id).delete()

    def add_stick(self, antenna_stick: AntennaStick):
        self.Session().add(antenna_stick)
