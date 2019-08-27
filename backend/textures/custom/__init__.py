from entity.body import Body
from rocket.ids import *
from .maple import get_maple_body_texture, get_maple_chassis_texture
from .dark_car import get_dark_car_body_texture


def handle_custom_body_texture(body: Body, primary_color: int = None, body_paint: int = None, team: int = None):
    if body.id == BODY_DARK_CAR_ID:
        return get_dark_car_body_texture(body, primary_color)
    if body.id == BODY_MAPLE_ID:
        return get_maple_body_texture(team)
    return None


def handle_custom_chassis_texture(body: Body, body_paint: int = None, team: int = None):
    if body.id == BODY_MAPLE_ID:
        return get_maple_chassis_texture(team)
    return None