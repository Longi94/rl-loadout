from sqlalchemy import Column, Integer, String
from .base import Base


class Product(Base):
    __tablename__ = 'product'

    id = Column(Integer, primary_key=True)
    type = Column(String(255), nullable=False)
    product_name = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'type': self.type,
            'product_name': self.product_name,
            'name': self.name
        }
