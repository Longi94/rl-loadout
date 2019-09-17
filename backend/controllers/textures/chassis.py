from dao import BodyDao
from textures.chassis_texture import generate_chassis_texture
from utils.network import get_asset_url, serve_pil_image
from utils.network.exc import NotFoundException
from utils.color import get_primary_color, get_accent_color, get_paint_color
from textures.custom import handle_custom_chassis_texture
from rocket.team import TEAM_BLUE

body_dao = BodyDao()


def get(body_id: int, body_paint: int = None, body_paint_custom: int = None, team: int = TEAM_BLUE,
        primary_color: int = None, primary_color_custom: int = None, accent_color: int = 0,
        accent_color_custom: int = None, fallback: bool = False):
    """
    :param body_id: The ID of the body used in replay files
    :param body_paint: The ID of the paint. See
        https://github.com/Longi94/rl-loadout/blob/master/backend/rocket/paint.py for list of IDs.
    :param body_paint_custom: Custom body paint color of the body in 0xFFFFFF integer format.
    :param primary_color: The ID primary color of the body.
    :param primary_color_custom: Custom primary color of the body in 0xFFFFFF integer format.
    :param accent_color: The ID of accent color of the body.
    :param accent_color_custom: Custom accent color of the body in 0xFFFFFF integer format.
    :param team: Used when the chassis has different textures for the teams (e.g. Jurassic Jeep)
    :param fallback: If set to true, If the body is not found, it will fall back to the Octane skin. Otherwise, returns
        with 404.
    """
    body = body_dao.get(body_id)

    if body is None:
        if fallback:
            body = body_dao.get_default()
        else:
            raise NotFoundException('Body not found')

    primary_color_value = get_primary_color(primary_color, primary_color_custom, team)
    accent_color_value = get_accent_color(accent_color, accent_color_custom)

    body_paint_color = get_paint_color(body_paint, body_paint_custom)

    image = handle_custom_chassis_texture(body, body_paint_color, team, primary_color_value)

    if image is not None:
        return serve_pil_image(image)

    if body.chassis_base is None:
        raise NotFoundException(
            'Body has no chassis textures. This is most likely because the chassis is not paintable.')

    image = generate_chassis_texture(
        get_asset_url(body.chassis_base),
        get_asset_url(body.chassis_n),
        body_paint_color,
        accent_color_value
    )

    return serve_pil_image(image)
