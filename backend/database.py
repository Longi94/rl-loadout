import logging
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, create_engine, Boolean
from sqlalchemy.engine.url import URL
from sqlalchemy.orm import sessionmaker
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
    chassis_base = Column(String(255), nullable=False)
    chassis_rgb_map = Column(String(255), nullable=True)
    topper_pos_x = Column(Integer, nullable=False, default=0)
    topper_pos_y = Column(Integer, nullable=False, default=0)
    topper_pos_z = Column(Integer, nullable=False, default=0)
    topper_rot_x = Column(Integer, nullable=False, default=0)
    topper_rot_y = Column(Integer, nullable=False, default=0)
    topper_rot_z = Column(Integer, nullable=False, default=0)

    def to_dict(self):
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
            'chassis_base': self.chassis_base,
            'chassis_rgb_map': self.chassis_rgb_map,
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
    rim_base = Column(String(255), nullable=False)
    rim_rgb_map = Column(String(255), nullable=False)

    def to_dict(self):
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


class Db(object):
    def __init__(self):
        self.url = URL(
            drivername='mysql',
            username=config.get('mysql', 'username'),
            password=config.get('mysql', 'password'),
            host=config.get('mysql', 'host'),
            port=int(config.get('mysql', 'port')),
            database=config.get('mysql', 'database')
        )

        self.engine = create_engine(self.url)
        Base.metadata.create_all(self.engine)
        self.Session = sessionmaker(bind=self.engine)

    def get_bodies(self):
        session = self.Session()
        return session.query(Body)

    def get_wheels(self):
        session = self.Session()
        return session.query(Wheel)
