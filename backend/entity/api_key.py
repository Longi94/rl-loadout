from sqlalchemy import Column, String, Boolean
from .base import Base


class ApiKey(Base):
    __tablename__ = 'api_key'

    key = Column(String(32), primary_key=True)
    name = Column(String(255), nullable=False)
    description = Column(String(255), nullable=False)
    active = Column(Boolean, nullable=False, default=False)
