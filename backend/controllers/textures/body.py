from PIL import Image
from dao import BodyDao
from textures.body_texture import BodyTexture
from utils.network import get_asset_url, serve_pil_image
from utils.network.exc import NotFoundException
from rocket.team import TEAM_ORANGE
from .custom import handle_custom_body_texture

body_dao = BodyDao()


def get(body_id: int, primary_color: int = None, body_paint: int = None, team: int = None):
    """
    :param body_id: The ID of the body used in replay files
    :param primary_color: The primary color of the body in 0xFFFFFF integer format. If not provided, the default blue is applied.
    :param body_paint: The color of the paint applied to the body
    :param team: If this is set, the default blue (0) or the default orange(0) color will be used. This is ignored if primary_color is set.
    """
    body = body_dao.get(body_id)

    if body is None:
        raise NotFoundException('Body not found')

    response = handle_custom_body_texture(body, primary_color, body_paint, team)

    if response is not None:
        return response

    if primary_color is None:
        if team == TEAM_ORANGE:
            primary_color = 0xFC7C0C
        else:
            primary_color = 0x0C88FC

    static_skin = BodyTexture(
        get_asset_url(body.base_skin),
        get_asset_url(body.blank_skin),
        primary_color,
        body_paint
    )

    static_skin.load()
    static_skin.update()

    image = Image.fromarray(static_skin.data)

    return serve_pil_image(image)
