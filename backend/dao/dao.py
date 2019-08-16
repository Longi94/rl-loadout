from database import database


class BaseDao(object):

    def __init__(self):
        self.Session = database.Session
