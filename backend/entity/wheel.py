from typing import Dict
from sqlalchemy import Column, String
from .base import Base
from .item import BaseItem


class Wheel(Base, BaseItem):
    __tablename__ = 'wheel'
    model = Column(String(255), nullable=False)
    rim_base = Column(String(255), nullable=True)
    rim_rgb_map = Column(String(255), nullable=True)
    rim_n = Column(String(255), nullable=True)
    tire_base = Column(String(255), nullable=True)
    tire_n = Column(String(255), nullable=True)

    def apply_dict(self, item_dict: Dict):
        super().apply_dict(item_dict)
        self.model = item_dict.get('model', None)
        self.rim_base = item_dict.get('rim_base', None)
        self.rim_rgb_map = item_dict.get('rim_rgb_map', None)
        self.rim_n = item_dict.get('rim_n', None)
        self.tire_base = item_dict.get('tire_base', None)
        self.tire_n = item_dict.get('tire_n', None)

    def to_dict(self) -> Dict:
        d = super(Wheel, self).to_dict()

        d['model'] = self.model
        d['rim_base'] = self.rim_base
        d['rim_rgb_map'] = self.rim_rgb_map
        d['rim_n'] = self.rim_n
        d['tire_base'] = self.tire_base
        d['tire_n'] = self.tire_n

        return d

    def update(self, item_dict: Dict):
        super(Wheel, self).update(item_dict)
        if 'model' in item_dict:
            self.model = item_dict['model']
        if 'rim_base' in item_dict:
            self.rim_base = item_dict['rim_base']
        if 'rim_rgb_map' in item_dict:
            self.rim_rgb_map = item_dict['rim_rgb_map']
        if 'rim_n' in item_dict:
            self.rim_n = item_dict['rim_n']
        if 'tire_base' in item_dict:
            self.tire_base = item_dict['tire_base']
        if 'tire_n' in item_dict:
            self.tire_n = item_dict['tire_n']
