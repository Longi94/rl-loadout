from typing import List
from .dao import BaseDao
from entity import Topper


class TopperDao(BaseDao):
    T = Topper
