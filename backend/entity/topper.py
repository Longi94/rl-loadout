from typing import Dict
from sqlalchemy import Column, String
from .base import Base
from .item import BaseItem


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

    def update(self, item_dict: Dict):
        super(Topper, self).update(item_dict)
        if 'model' in item_dict:
            self.model = item_dict['model']
        if 'base_texture' in item_dict:
            self.base_texture = item_dict['base_texture']
        if 'rgba_map' in item_dict:
            self.rgba_map = item_dict['rgba_map']
