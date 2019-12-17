from typing import Dict
from sqlalchemy import Column, String, Boolean
from sqlalchemy.orm import relationship
from .base import Base
from .item import BaseItem


class Body(Base, BaseItem):
    __tablename__ = 'body'
    model = Column(String(255), nullable=False)
    blank_skin = Column(String(255), nullable=True)
    base_skin = Column(String(255), nullable=True)
    chassis_base = Column(String(255), nullable=True)
    chassis_n = Column(String(255), nullable=True)
    chassis_paintable = Column(Boolean(), nullable=False, default=False)
    decals = relationship('Decal')

    def apply_dict(self, item_dict: Dict):
        super().apply_dict(item_dict)
        self.model = item_dict.get('model', None)
        self.blank_skin = item_dict.get('blank_skin', None)
        self.base_skin = item_dict.get('base_skin', None)
        self.chassis_base = item_dict.get('chassis_base', None)
        self.chassis_n = item_dict.get('chassis_n', None)
        self.chassis_paintable = item_dict.get('chassis_paintable', None)

    def to_dict(self) -> Dict:
        d = super(Body, self).to_dict()

        d['model'] = self.model
        d['blank_skin'] = self.blank_skin
        d['base_skin'] = self.base_skin
        d['chassis_base'] = self.chassis_base
        d['chassis_n'] = self.chassis_n
        d['chassis_paintable'] = self.chassis_paintable

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
        if 'chassis_paintable' in item_dict:
            self.chassis_paintable = item_dict['chassis_paintable']
