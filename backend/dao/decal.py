from typing import List
from .dao import BaseDao
from entity import Decal, DecalDetail, Body


class DecalDao(BaseDao):

    def get_all(self, body_id: int) -> List[Decal]:
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

    def delete(self, decal_id: int):
        session = self.Session()
        session.query(Decal).filter(Decal.id == decal_id).delete()

    def add(self, decal: Decal):
        self.Session().add(decal)

    def get_all_details(self) -> List[DecalDetail]:
        session = self.Session()
        return session.query(DecalDetail)

    def get_detail(self, detail_id) -> DecalDetail:
        session = self.Session()
        return session.query(DecalDetail).get(detail_id)

    def delete_detail(self, decal_detail_id: int):
        session = self.Session()
        session.query(DecalDetail).filter(DecalDetail.id == decal_detail_id).delete()

    def add_detail(self, decal_detail: DecalDetail):
        self.Session().add(decal_detail)
