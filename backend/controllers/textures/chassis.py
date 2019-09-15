from dao import BodyDao
from textures.chassis_texture import generate_chassis_texture
from utils.network import get_asset_url, serve_pil_image
from utils.network.exc import NotFoundException
from utils.color import PAINT_COLORS, get_primary_color
from textures.custom import handle_custom_chassis_texture
from rocket.team import TEAM_BLUE

body_dao = BodyDao()


def get(body_id: int, body_paint: int = None, body_paint_custom: int = None, team: int = TEAM_BLUE,
        primary_color: int = None, primary_color_custom: int = None):
    """
    :param body_id: The ID of the body used in replay files
    :param body_paint: The ID of the paint. See
        https://github.com/Longi94/rl-loadout/blob/master/backend/rocket/paint.py for list of IDs.
    :param body_paint_custom: Custom body paint color of the body in 0xFFFFFF integer format.
    :param primary_color: The ID primary color of the body.
    :param primary_color_custom: Custom primary color of the body in 0xFFFFFF integer format.
    :param team: Used when the chassis has different textures for the teams (e.g. Jurassic Jeep)
    """
    body = body_dao.get(body_id)

    if body is None:
        raise NotFoundException('Body not found')

    primary_color_value = get_primary_color(primary_color, primary_color_custom, team)

    body_paint_color = None

    if body_paint is not None:
        body_paint_color = PAINT_COLORS[body_paint]
    if body_paint_custom is not None:
        body_paint_color = body_paint_custom

    image = handle_custom_chassis_texture(body, body_paint_color, team, primary_color_value)

    if image is not None:
        return serve_pil_image(image)

    if body.chassis_base is None:
        raise NotFoundException(
            'Body has no chassis textures. This is most likely because the chassis is not paintable.')

    image = generate_chassis_texture(
        get_asset_url(body.chassis_base),
        get_asset_url(body.chassis_n),
        body_paint_color
    )

    return serve_pil_image(image)
