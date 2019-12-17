from sqlalchemy.orm.exc import NoResultFound, MultipleResultsFound
from entity import ApiKey
from .dao import BaseDao


class ApiKeyDao(BaseDao):
    T = ApiKey

    def get_by_value(self, key: str) -> ApiKey or None:
        session = self.Session()
        try:
            return session.query(ApiKey).filter(ApiKey.key == key).one()
        except (MultipleResultsFound, NoResultFound):
            return None
