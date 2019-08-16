from PIL import Image
from dao import BodyDao
from textures.body_texture import BodyTexture
from utils.network import get_asset_url, serve_pil_image
from utils.network.exc import NotFoundException

body_dao = BodyDao()


def get(body_id: int, primary_color: int = None, body_paint: int = None, format: str = None):
    """
    :param body_id: The ID of the body used in replay files
    :type body_id: int
    :param primary_color: The primary color of the body in 0xFFFFFF integer format. If not provided, the default blue is applied.
    :type primary_color: int
    :param body_paint: The color of the paint applied to the body
    :type body_paint: int
    :param format: The format of the image texture
    :type format: str

    :rtype: str
    """
    body = body_dao.get_by_replay_id(body_id)

    if body is None:
        raise NotFoundException('Body not found')

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
