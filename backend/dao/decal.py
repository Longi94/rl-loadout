from typing import List
from .dao import BaseDao
from entity import Decal, Body


class DecalDao(BaseDao):
    T = Decal

    def get_all_for_body(self, body_id: int) -> List[Decal]:
        """
        Find decals that are applicable to a body

        :param body_id: id of the body
        :return: decal
        """
        session = self.Session()
        if body_id is not None:
            body = session.query(Body).get(body_id)
            if body is None:
                return []
            return body.decals
        return session.query(Decal)
