from typing import List
from sqlalchemy.orm.exc import NoResultFound, MultipleResultsFound
from entity import ApiKey
from .dao import BaseDao


class ApiKeyDao(BaseDao):

    def __init__(self):
        super(ApiKeyDao, self).__init__()

    def get_all(self) -> List[ApiKey]:
        return self.Session().query(ApiKey)

    def get_by_value(self, key: str) -> ApiKey or None:
        session = self.Session()
        try:
            return session.query(ApiKey).filter(ApiKey.key == key).one()
        except (MultipleResultsFound, NoResultFound):
            return None

    def add(self, api_key: ApiKey):
        self.Session().add(api_key)

    def delete(self, key_id):
        session = self.Session()
        session.query(ApiKey).filter(ApiKey.id == key_id).delete()
