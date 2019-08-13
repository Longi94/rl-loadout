from typing import Dict
from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base
from .item import BaseItem


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
