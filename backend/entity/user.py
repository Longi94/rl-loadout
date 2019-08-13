from .base import Base
from sqlalchemy import Column, Integer, String


class User(Base):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False, unique=True)
    password = Column(String(255), nullable=False)
