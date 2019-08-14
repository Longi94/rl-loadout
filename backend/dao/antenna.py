from typing import List
from .dao import BaseDao
from entity import Antenna, AntennaStick


class AntennaDao(BaseDao):

    def get_all(self) -> List[Antenna]:
        session = self.Session()
        return session.query(Antenna)

    def delete(self, antenna_id: int):
        session = self.Session()
        session.query(Antenna).filter(Antenna.id == antenna_id).delete()

    def add(self, antenna: Antenna):
        self.Session().add(antenna)

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
