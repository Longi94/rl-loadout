import logging
from typing import List, Dict
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, create_engine, Boolean, ForeignKey, Float
from sqlalchemy.engine.url import URL
from sqlalchemy.orm import sessionmaker, relationship, scoped_session
from config import config

log = logging.getLogger(__name__)

Base = declarative_base()


class BaseItem:
    __tablename__ = ''
    id = Column(Integer, primary_key=True)
    replay_id = Column(Integer, nullable=True)
    name = Column(String(255), nullable=False)
    quality = Column(Integer, nullable=False)
    icon = Column(String(255), nullable=False)
    paintable = Column(Boolean, nullable=False, default=False)


class Body(Base, BaseItem):
    __tablename__ = 'body'
    model = Column(String(255), nullable=False)
    blank_skin = Column(String(255), nullable=False)
    displacement_map = Column(String(255), nullable=False)
    topper_pos_x = Column(Float(5), nullable=False, default=0.0)
    topper_pos_y = Column(Float(5), nullable=False, default=0.0)
    topper_pos_z = Column(Float(5), nullable=False, default=0.0)
    topper_rot_x = Column(Float(5), nullable=False, default=0.0)
    topper_rot_y = Column(Float(5), nullable=False, default=0.0)
    topper_rot_z = Column(Float(5), nullable=False, default=0.0)
    decals = relationship('Decal')

    def to_dict(self) -> Dict:
        """Return object data in easily serializable format"""
        return {
            'id': self.id,
            'replay_id': self.replay_id,
            'name': self.name,
            'quality': self.quality,
            'icon': self.icon,
            'paintable': self.paintable,
            'model': self.model,
            'blank_skin': self.blank_skin,
            'displacement_map': self.displacement_map,
            'topper_pos_x': self.topper_pos_x,
            'topper_pos_y': self.topper_pos_y,
            'topper_pos_z': self.topper_pos_z,
            'topper_rot_x': self.topper_rot_x,
            'topper_rot_y': self.topper_rot_y,
            'topper_rot_z': self.topper_rot_z
        }


class Wheel(Base, BaseItem):
    __tablename__ = 'wheel'
    model = Column(String(255), nullable=False)
    rim_base = Column(String(255), nullable=True)
    rim_rgb_map = Column(String(255), nullable=True)

    def to_dict(self) -> Dict:
        """Return object data in easily serializable format"""
        return {
            'id': self.id,
            'replay_id': self.replay_id,
            'name': self.name,
            'quality': self.quality,
            'icon': self.icon,
            'paintable': self.paintable,
            'model': self.model,
            'rim_base': self.rim_base,
            'rim_rgb_map': self.rim_rgb_map
        }


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

    def to_dict(self) -> Dict:
        """Return object data in easily serializable format"""
        quality = self.quality

        if quality is None:
            quality = self.decal_detail.quality

        return {
            'id': self.id,
            'replay_id': self.decal_detail.replay_id,
            'name': self.decal_detail.name,
            'quality': quality,
            'icon': self.decal_detail.icon,
            'paintable': self.decal_detail.paintable,
            'base_texture': self.base_texture,
            'rgba_map': self.rgba_map
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
        Base.metadata.create_all(self.engine)
        self.Session = scoped_session(sessionmaker(bind=self.engine))

    def get_bodies(self) -> List[Body]:
        """
        :return: all the bodies
        """
        session = self.Session()
        return session.query(Body)

    def get_wheels(self) -> List[Wheel]:
        """
        :return: all the wheels
        """
        session = self.Session()
        return session.query(Wheel)

    def get_decals(self, body_id: int) -> List[Decal]:
        """
        Find decals that are applicable to a body

        :param body_id: id of the body
        :return: decal
        """
        session = self.Session()
        body = session.query(Body).get(body_id)
        if body is None:
            return []
        return body.decals

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
