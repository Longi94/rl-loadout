from typing import Dict
from sqlalchemy import Column, String, Integer, Float
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
    hitbox_translate_x = Column(Float, nullable=True)
    hitbox_translate_z = Column(Float, nullable=True)

    def apply_dict(self, item_dict: Dict):
        super().apply_dict(item_dict)
        self.model = item_dict.get('model', None)
        self.blank_skin = item_dict.get('blank_skin', None)
        self.base_skin = item_dict.get('base_skin', None)
        self.chassis_base = item_dict.get('chassis_base', None)
        self.chassis_n = item_dict.get('chassis_n', None)
        self.hitbox = item_dict.get('hitbox', None)
        self.hitbox_translate_x = item_dict.get('hitbox_translate_x', None)
        self.hitbox_translate_z = item_dict.get('hitbox_translate_z', None)

    def to_dict(self) -> Dict:
        d = super(Body, self).to_dict()

        d['model'] = self.model
        d['blank_skin'] = self.blank_skin
        d['base_skin'] = self.base_skin
        d['chassis_base'] = self.chassis_base
        d['chassis_n'] = self.chassis_n
        d['hitbox'] = self.hitbox
        d['hitbox_translate_x'] = self.hitbox_translate_x
        d['hitbox_translate_z'] = self.hitbox_translate_z

        return d

    def update(self, item_dict: Dict):
        super().update(item_dict)
        if 'model' in item_dict:
            self.model = item_dict['model']
        if 'blank_skin' in item_dict:
            self.blank_skin = item_dict['blank_skin']
        if 'base_skin' in item_dict:
            self.base_skin = item_dict['base_skin']
        if 'chassis_base' in item_dict:
            self.chassis_base = item_dict['chassis_base']
        if 'chassis_n' in item_dict:
            self.chassis_n = item_dict['chassis_n']
        if 'model' in item_dict:
            self.model = item_dict['model']
        if 'hitbox' in item_dict:
            self.hitbox = item_dict['hitbox']
        if 'hitbox_translate_x' in item_dict:
            self.hitbox_translate_x = item_dict['hitbox_translate_x']
        if 'hitbox_translate_z' in item_dict:
            self.hitbox_translate_z = item_dict['hitbox_translate_z']
