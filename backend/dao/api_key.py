from entity import ApiKey
from .dao import BaseDao


class ApiKeyDao(BaseDao):

    def __init__(self):
        super(ApiKeyDao, self).__init__()

    def get(self, key: str) -> ApiKey:
        session = self.Session()
        return session.query(ApiKey).get(key)
