from typing import Dict
from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base
from .item import BaseItem


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

    def apply_dict(self, item_dict: Dict):
        self.id = item_dict.get('id', None)
        self.base_texture = item_dict.get('base_texture', None)
        self.rgba_map = item_dict.get('rgba_map', None)
        self.body_id = item_dict.get('body_id', None)
        self.decal_detail_id = item_dict.get('decal_detail_id', None)
        self.quality = item_dict.get('quality', None)

    def to_dict(self) -> Dict:
        """Return object data in easily serializable format"""
        quality = self.quality

        if quality is None:
            quality = self.decal_detail.quality

        body_name = None
        if self.body:
            body_name = self.body.name

        return {
            'id': self.id,
            'name': self.decal_detail.name,
            'quality': quality,
            'icon': self.decal_detail.icon,
            'paintable': self.decal_detail.paintable,
            'base_texture': self.base_texture,
            'rgba_map': self.rgba_map,
            'body_id': self.body_id,
            'body_name': body_name
        }

    def update(self, item_dict: Dict):
        if 'base_texture' in item_dict:
            self.base_texture = item_dict['base_texture']
        if 'rgba_map' in item_dict:
            self.rgba_map = item_dict['rgba_map']
        if 'body_id' in item_dict:
            self.body_id = item_dict['body_id']
        if 'decal_detail_id' in item_dict:
            self.decal_detail_id = item_dict['decal_detail_id']
        if 'quality' in item_dict:
            self.quality = item_dict['quality']
