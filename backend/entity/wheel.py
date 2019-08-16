from typing import Dict
from sqlalchemy import Column, String
from .base import Base
from .item import BaseItem


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
