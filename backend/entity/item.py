from typing import Dict
from sqlalchemy import Column, Integer, String, Boolean


class BaseItem:
    __tablename__ = ''
    id = Column(Integer, primary_key=True)
    replay_id = Column(Integer, nullable=True)
    name = Column(String(255), nullable=False)
    quality = Column(Integer, nullable=False)
    icon = Column(String(255), nullable=False)
    paintable = Column(Boolean, nullable=False, default=False)

    def apply_dict(self, item_dict: Dict):
        self.id = item_dict.get('id', None)
        self.replay_id = item_dict.get('replay_id', None)
        self.name = item_dict.get('name', None)
        self.quality = item_dict.get('quality', None)
        self.icon = item_dict.get('icon', None)
        self.paintable = item_dict.get('paintable', None)

    def to_dict(self) -> Dict:
        """Return object data in easily serializable format"""
        return {
            'id': self.id,
            'replay_id': self.replay_id,
            'name': self.name,
            'quality': self.quality,
            'icon': self.icon,
            'paintable': self.paintable
        }
