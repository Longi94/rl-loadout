from entity import Product
from .dao import BaseDao


class BaseItemDao(BaseDao):

    def get_all_join_product(self):
        session = self.Session()
        return session.query(self.T, Product).join(Product)
