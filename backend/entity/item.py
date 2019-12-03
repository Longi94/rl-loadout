from typing import Dict
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declared_attr
from entity.product import Product


class BaseItem:
    __tablename__ = ''

    @declared_attr
    def id(cls):
        return Column(Integer, ForeignKey('product.id'), primary_key=True)

    quality = Column(Integer, nullable=False)
    icon = Column(String(255), nullable=False)
    paintable = Column(Boolean, nullable=False, default=False)

    def apply_dict(self, item_dict: Dict):
        self.id = item_dict.get('id', None)
        self.quality = item_dict.get('quality', None)
        self.icon = item_dict.get('icon', None)
        self.paintable = item_dict.get('paintable', None)

    def to_dict(self) -> Dict:
        """Return object data in easily serializable format"""
        return {
            'id': self.id,
            'quality': self.quality,
            'icon': self.icon,
            'paintable': self.paintable
        }

    def update(self, item_dict: Dict):
        if 'id' in item_dict:
            self.id = item_dict['id']
        if 'quality' in item_dict:
            self.quality = item_dict['quality']
        if 'icon' in item_dict:
            self.icon = item_dict['icon']
        if 'paintable' in item_dict:
            self.paintable = item_dict['paintable']

    def product_joined_to_dict(self, product: Product):
        d = self.to_dict()
        d['name'] = product.name
        d['product_name'] = product.product_name
        return d
