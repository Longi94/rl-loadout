from dao import BodyDao, DecalDao
from entity import Decal, Body
from textures.body_texture import generate_body_texture
from utils.network import get_asset_url, serve_pil_image
from utils.network.exc import NotFoundException
from utils.color import get_primary_color, get_accent_color, get_paint_color
from rocket.team import TEAM_BLUE
from textures.custom import handle_custom_body_texture

body_dao = BodyDao()
decal_dao = DecalDao()


def get(body_id: int, primary_color: int = None, primary_color_custom: int = None, body_paint: int = None,
        body_paint_custom: int = None, team: int = TEAM_BLUE, accent_color: int = 0,
        accent_color_custom: int = None, fallback: bool = False, decal_id: int = 0, decal_paint: int = None,
        decal_paint_custom: int = None):
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
    :param fallback: If set to true, if the decal is not found, it will fall back to the default skin of the body. If
        the body is not found, it will fall back to the Octane skin. Otherwise, returns with 404.
    :param decal_id: The ID of the decal used in replay files. 0 for no decal.
    :param decal_paint: The ID of the decal paint. See
        https://github.com/Longi94/rl-loadout/blob/master/backend/rocket/paint.py for list of IDs.
    :param decal_paint_custom: Custom decal paint color of the body in 0xFFFFFF integer format.
    """
    body: Body = body_dao.get(body_id)
    decal: Decal = decal_dao.get(decal_id)

    if body is None:
        if fallback:
            body = body_dao.get_default()
        else:
            raise NotFoundException('Body not found')

    if decal_id > 0 and decal is None and not fallback:
        raise NotFoundException('Decal not found')

    primary_color_value = get_primary_color(primary_color, primary_color_custom, team)
    accent_color_value = get_accent_color(accent_color, accent_color_custom)

    body_paint_color = get_paint_color(body_paint, body_paint_custom)
    decal_paint_color = get_paint_color(decal_paint, decal_paint_custom)

    image = handle_custom_body_texture(body, primary_color_value, body_paint_color, team)

    if image is None:
        image = generate_body_texture(
            get_asset_url(body.base_skin),
            get_asset_url(body.blank_skin),
            get_asset_url(decal.base_texture) if decal is not None else None,
            get_asset_url(decal.rgba_map) if decal is not None else None,
            primary_color_value,
            accent_color_value,
            body_paint_color,
            decal_paint_color
        )

    return serve_pil_image(image)
