import logging
from typing import List, Dict
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, create_engine, Boolean, ForeignKey
from sqlalchemy.engine.url import URL
from sqlalchemy.orm import sessionmaker, relationship, scoped_session
from config import config

log = logging.getLogger(__name__)

Base = declarative_base()


class User(Base):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False, unique=True)
    password = Column(String(255), nullable=False)


class BaseItem:
    __tablename__ = ''
    id = Column(Integer, primary_key=True)
    replay_id = Column(Integer, nullable=True)
    name = Column(String(255), nullable=False)
    quality = Column(Integer, nullable=False)
    icon = Column(String(255), nullable=False)
    paintable = Column(Boolean, nullable=False, default=False)

    def apply_dict(self, item_dict: Dict):
        self.id = item_dict.get('id', None)
        self.replay_id = item_dict.get('replay_id', None)
        self.name = item_dict.get('name', None)
        self.quality = item_dict.get('quality', None)
        self.icon = item_dict.get('icon', None)
        self.paintable = item_dict.get('paintable', None)

    def to_dict(self) -> Dict:
        """Return object data in easily serializable format"""
        return {
            'id': self.id,
            'replay_id': self.replay_id,
            'name': self.name,
            'quality': self.quality,
            'icon': self.icon,
            'paintable': self.paintable
        }


class Body(Base, BaseItem):
    __tablename__ = 'body'
    model = Column(String(255), nullable=False)
    blank_skin = Column(String(255), nullable=False)
    base_skin = Column(String(255), nullable=True)
    chassis_base = Column(String(255), nullable=True)
    chassis_n = Column(String(255), nullable=True)
    decals = relationship('Decal')

    def apply_dict(self, item_dict: Dict):
        super().apply_dict(item_dict)
        self.model = item_dict.get('model', None)
        self.blank_skin = item_dict.get('blank_skin', None)
        self.base_skin = item_dict.get('base_skin', None)
        self.chassis_base = item_dict.get('chassis_base', None)
        self.chassis_n = item_dict.get('chassis_n', None)

    def to_dict(self) -> Dict:
        d = super(Body, self).to_dict()

        d['model'] = self.model
        d['blank_skin'] = self.blank_skin
        d['base_skin'] = self.base_skin
        d['chassis_base'] = self.chassis_base
        d['chassis_n'] = self.chassis_n

        return d


class Wheel(Base, BaseItem):
    __tablename__ = 'wheel'
    model = Column(String(255), nullable=False)
    rim_base = Column(String(255), nullable=True)
    rim_rgb_map = Column(String(255), nullable=True)

    def apply_dict(self, item_dict: Dict):
        super().apply_dict(item_dict)
        self.model = item_dict.get('model', None)
        self.rim_base = item_dict.get('rim_base', None)
        self.rim_rgb_map = item_dict.get('rim_rgb_map', None)

    def to_dict(self) -> Dict:
        d = super(Wheel, self).to_dict()

        d['model'] = self.model
        d['rim_base'] = self.rim_base
        d['rim_rgb_map'] = self.rim_rgb_map

        return d


class DecalDetail(Base, BaseItem):
    __tablename__ = 'decal_detail'
    decals = relationship('Decal')


class Decal(Base):
    __tablename__ = 'decal'
    id = Column(Integer, primary_key=True)
    base_texture = Column(String(255), nullable=True)
    rgba_map = Column(String(255), nullable=False)
    body_id = Column(Integer, ForeignKey('body.id'), nullable=True)
    body = relationship('Body', back_populates='decals')
    decal_detail_id = Column(Integer, ForeignKey('decal_detail.id'), nullable=False)
    decal_detail = relationship('DecalDetail', back_populates='decals')
    quality = Column(Integer, nullable=True)

    def apply_dict(self, item_dict: Dict):
        self.id = item_dict.get('id', None)
        self.base_texture = item_dict.get('base_texture', None)
        self.rgba_map = item_dict.get('rgba_map', None)
        self.body_id = item_dict.get('body_id', None)
        self.decal_detail_id = item_dict.get('decal_detail_id', None)
        self.quality = item_dict.get('quality', None)

    def to_dict(self) -> Dict:
        """Return object data in easily serializable format"""
        quality = self.quality

        if quality is None:
            quality = self.decal_detail.quality

        body_name = None
        if self.body:
            body_name = self.body.name

        return {
            'id': self.id,
            'replay_id': self.decal_detail.replay_id,
            'name': self.decal_detail.name,
            'quality': quality,
            'icon': self.decal_detail.icon,
            'paintable': self.decal_detail.paintable,
            'base_texture': self.base_texture,
            'rgba_map': self.rgba_map,
            'body_id': self.body_id,
            'body_name': body_name
        }


class Topper(Base, BaseItem):
    __tablename__ = 'topper'
    model = Column(String(255), nullable=False)
    base_texture = Column(String(255), nullable=True)
    rgba_map = Column(String(255), nullable=True)

    def apply_dict(self, item_dict: Dict):
        super().apply_dict(item_dict)
        self.model = item_dict.get('model', None)
        self.base_texture = item_dict.get('base_texture', None)
        self.rgba_map = item_dict.get('rgba_map', None)

    def to_dict(self) -> Dict:
        d = super(Topper, self).to_dict()

        d['model'] = self.model
        d['base_texture'] = self.base_texture
        d['rgba_map'] = self.rgba_map

        return d


class Antenna(Base, BaseItem):
    __tablename__ = 'antenna'
    model = Column(String(255), nullable=False)
    base_texture = Column(String(255), nullable=True)
    rgba_map = Column(String(255), nullable=True)
    stick_id = Column(Integer, ForeignKey('antenna_stick.id'), nullable=False)
    stick = relationship('AntennaStick')

    def apply_dict(self, item_dict: Dict):
        super().apply_dict(item_dict)
        self.model = item_dict.get('model', None)
        self.base_texture = item_dict.get('base_texture', None)
        self.rgba_map = item_dict.get('rgba_map', None)
        self.stick_id = item_dict.get('stick_id', None)

    def to_dict(self) -> Dict:
        d = super(Antenna, self).to_dict()

        d['model'] = self.model
        d['base_texture'] = self.base_texture
        d['rgba_map'] = self.rgba_map
        d['stick'] = self.stick.model

        return d


class AntennaStick(Base):
    __tablename__ = 'antenna_stick'
    id = Column(Integer, primary_key=True)
    model = Column(String(255), nullable=False)
    
    def apply_dict(self, item_dict):
        self.id = item_dict.get('id', None)
        self.model = item_dict.get('model', None)

    def to_dict(self) -> Dict:
        return {
            'id': self.id,
            'model': self.model
        }


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

    def get_bodies(self) -> List[Body]:
        session = self.Session()
        return session.query(Body)

    def get_body(self, body_id) -> Body:
        session = self.Session()
        return session.query(Body).get(body_id)

    def delete_body(self, body_id: int):
        session = self.Session()
        session.query(Body).filter(Body.id == body_id).delete()

    def add_body(self, body: Body):
        self.Session().add(body)

    def get_wheels(self) -> List[Wheel]:
        session = self.Session()
        return session.query(Wheel)

    def delete_wheel(self, wheel_id: int):
        session = self.Session()
        session.query(Wheel).filter(Wheel.id == wheel_id).delete()

    def add_wheel(self, wheel: Wheel):
        self.Session().add(wheel)

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
