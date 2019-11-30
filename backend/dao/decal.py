from typing import List
from .item import BaseItemDao
from entity import Decal, Body, Product


class DecalDao(BaseItemDao):
    T = Decal

    def get_all_for_body(self, body_id: int) -> List:
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
            return session.query(Decal, Product).join(Product).filter(Decal.body_id == body_id)
        return session.query(Decal, Product).join(Product)
