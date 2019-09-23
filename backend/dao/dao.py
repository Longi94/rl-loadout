from typing import List
from database import database


class BaseDao(object):
    T = None

    def __init__(self):
        self.Session = database.Session

    def get(self, record_id) -> T:
        if record_id is None:
            return None
        session = self.Session()
        return session.query(self.T).get(record_id)

    def get_all(self) -> List[T]:
        session = self.Session()
        return session.query(self.T)

    def add(self, record: T):
        self.Session().add(record)

    def delete(self, record_id):
        session = self.Session()
        session.query(self.T).filter(self.T.id == record_id).delete()
