from dao import BodyDao
from textures.body_texture import generate_body_texture
from utils.network import get_asset_url, serve_pil_image
from utils.network.exc import NotFoundException
from utils.color import PAINT_COLORS, get_primary_color, get_accent_color
from rocket.team import TEAM_BLUE
from textures.custom import handle_custom_body_texture

body_dao = BodyDao()


def get(body_id: int, primary_color: int = None, primary_color_custom: int = None, body_paint: int = None,
        body_paint_custom: int = None, team: int = TEAM_BLUE, accent_color: int = 0,
        accent_color_custom: int = None):
    """
    Generate a body texture based on the body and provided colors. Custom colors will override any preset colors. If no
    colors are provided, the default blue/orange colors will be used depending on the "team" parameter.

    :param body_id: The ID of the body used in replay files
    :param primary_color: The ID primary color of the body.
    :param primary_color_custom: Custom primary color of the body in 0xFFFFFF integer format.
    :param accent_color: The ID of accent color of the body.
    :param accent_color_custom: Custom accent color of the body in 0xFFFFFF integer format.
    :param body_paint: The ID of the paint. See
        https://github.com/Longi94/rl-loadout/blob/master/backend/rocket/paint.py for list of IDs.
    :param body_paint_custom: Custom body paint color of the body in 0xFFFFFF integer format.
    :param team: If this is set, the default blue (0) or the default orange (1) color will be used. This is ignored if
        primary_color is set.
    """
    body = body_dao.get(body_id)

    if body is None:
        raise NotFoundException('Body not found')

    primary_color_value = get_primary_color(primary_color, primary_color_custom, team)
    accent_color_value = get_accent_color(accent_color, accent_color_custom)

    body_paint_color = None

    if body_paint is not None:
        body_paint_color = PAINT_COLORS[body_paint]
    if body_paint_custom is not None:
        body_paint_color = body_paint_custom

    image = handle_custom_body_texture(body, primary_color_value, body_paint_color, team)

    if image is None:
        image = generate_body_texture(
            get_asset_url(body.base_skin),
            get_asset_url(body.blank_skin),
            primary_color_value,
            accent_color_value,
            body_paint_color
        )

    return serve_pil_image(image)
