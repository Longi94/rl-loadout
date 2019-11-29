from entity import Product
from .dao import BaseDao


class ProductDao(BaseDao):
    T = Product
