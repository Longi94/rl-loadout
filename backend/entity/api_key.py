from sqlalchemy import Column, String, Boolean, Integer
from .base import Base


class ApiKey(Base):
    __tablename__ = 'api_key'

    id = Column(Integer, primary_key=True)
    key = Column(String(32), nullable=False, unique=True)
    name = Column(String(255), nullable=False)
    description = Column(String(255), nullable=False)
    active = Column(Boolean, nullable=False, default=False)

    def to_dict(self):
        return {
            'id': self.id,
            'key': self.key,
            'name': self.name,
            'description': self.description,
            'active': self.active,
        }

    def apply_dict(self, values):
        self.id = values.get('id', None)
        self.key = values.get('key', None)
        self.name = values.get('name', None)
        self.description = values.get('description', None)
        self.active = values.get('active', False)
