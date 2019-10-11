from typing import Dict
from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base
from .item import BaseItem


class Decal(Base, BaseItem):
    __tablename__ = 'decal'
    base_texture = Column(String(255), nullable=True)
    rgba_map = Column(String(255), nullable=False)
    body_id = Column(Integer, ForeignKey('body.id'), nullable=True)
    body = relationship('Body', back_populates='decals')

    def apply_dict(self, item_dict: Dict):
        super(Decal, self).apply_dict(item_dict)
        self.base_texture = item_dict.get('base_texture', None)
        self.rgba_map = item_dict.get('rgba_map', None)
        self.body_id = item_dict.get('body_id', None)

    def to_dict(self) -> Dict:
        """Return object data in easily serializable format"""
        body_name = None
        if self.body:
            body_name = self.body.name

        return {
            'id': self.id,
            'name': self.name,
            'quality': self.quality,
            'icon': self.icon,
            'paintable': self.paintable,
            'base_texture': self.base_texture,
            'rgba_map': self.rgba_map,
            'body_id': self.body_id,
            'body_name': body_name
        }

    def update(self, item_dict: Dict):
        super(Decal, self).update(item_dict)
        if 'base_texture' in item_dict:
            self.base_texture = item_dict['base_texture']
        if 'rgba_map' in item_dict:
            self.rgba_map = item_dict['rgba_map']
        if 'body_id' in item_dict:
            self.body_id = item_dict['body_id']
