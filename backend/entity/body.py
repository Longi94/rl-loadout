from typing import Dict
from sqlalchemy import Column, String, Integer
from sqlalchemy.orm import relationship
from .base import Base
from .item import BaseItem


class Body(Base, BaseItem):
    __tablename__ = 'body'
    model = Column(String(255), nullable=False)
    blank_skin = Column(String(255), nullable=False)
    base_skin = Column(String(255), nullable=True)
    chassis_base = Column(String(255), nullable=True)
    chassis_n = Column(String(255), nullable=True)
    decals = relationship('Decal')
    hitbox = Column(Integer, nullable=True)

    def apply_dict(self, item_dict: Dict):
        super().apply_dict(item_dict)
        self.model = item_dict.get('model', None)
        self.blank_skin = item_dict.get('blank_skin', None)
        self.base_skin = item_dict.get('base_skin', None)
        self.chassis_base = item_dict.get('chassis_base', None)
        self.chassis_n = item_dict.get('chassis_n', None)
        self.hitbox = item_dict.get('hitbox', None)

    def to_dict(self) -> Dict:
        d = super(Body, self).to_dict()

        d['model'] = self.model
        d['blank_skin'] = self.blank_skin
        d['base_skin'] = self.base_skin
        d['chassis_base'] = self.chassis_base
        d['chassis_n'] = self.chassis_n
        d['hitbox'] = self.hitbox

        return d
