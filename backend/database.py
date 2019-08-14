import logging
from typing import List
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

    def get_decals(self, body_id: int) -> List[Decal]:
        """
        Find decals that are applicable to a body

        :param body_id: id of the body
        :return: decal
        """
        session = self.Session()
        if body_id is not None:
            body = session.query(Body).get(body_id)
            if body is None:
                return []
            return body.decals
        return session.query(Decal)

    def delete_decal(self, decal_id: int):
        session = self.Session()
        session.query(Decal).filter(Decal.id == decal_id).delete()

    def add_decal(self, decal: Decal):
        self.Session().add(decal)

    def get_decal_details(self) -> List[DecalDetail]:
        session = self.Session()
        return session.query(DecalDetail)

    def get_decal_detail(self, detail_id) -> DecalDetail:
        session = self.Session()
        return session.query(DecalDetail).get(detail_id)

    def delete_decal_detail(self, decal_detail_id: int):
        session = self.Session()
        session.query(DecalDetail).filter(DecalDetail.id == decal_detail_id).delete()

    def add_decal_detail(self, decal_detail: DecalDetail):
        self.Session().add(decal_detail)

    def get_default_wheel(self) -> Wheel:
        """
        :return: the default OEM wheel
        """
        session = self.Session()
        return session.query(Wheel).filter(Wheel.name == 'OEM').first()

    def get_default_body(self) -> Body:
        """
        :return: the default body (Octane)
        """
        session = self.Session()
        return session.query(Body).filter(Body.name == 'Octane').first()

    def get_toppers(self) -> List[Topper]:
        session = self.Session()
        return session.query(Topper)

    def delete_topper(self, topper_id: int):
        session = self.Session()
        session.query(Topper).filter(Topper.id == topper_id).delete()

    def add_topper(self, topper: Topper):
        self.Session().add(topper)

    def get_antennas(self) -> List[Antenna]:
        session = self.Session()
        return session.query(Antenna)

    def delete_antenna(self, antenna_id: int):
        session = self.Session()
        session.query(Antenna).filter(Antenna.id == antenna_id).delete()

    def add_antenna(self, antenna: Antenna):
        self.Session().add(antenna)

    def get_antenna_sticks(self) -> List[AntennaStick]:
        session = self.Session()
        return session.query(AntennaStick)

    def get_antenna_stick(self, stick_id) -> AntennaStick:
        session = self.Session()
        return session.query(AntennaStick).get(stick_id)

    def delete_antenna_stick(self, antenna_stick_id: int):
        session = self.Session()
        session.query(AntennaStick).filter(AntennaStick.id == antenna_stick_id).delete()

    def add_antenna_stick(self, antenna_stick: AntennaStick):
        self.Session().add(antenna_stick)


database = Db()
