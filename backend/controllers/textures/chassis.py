from PIL import Image
from dao import BodyDao
from textures.chassis_texture import ChassisTexture
from utils.network import get_asset_url, serve_pil_image
from utils.network.exc import NotFoundException

body_dao = BodyDao()


def get(body_id: int, body_paint: int = None):
    """
    :param body_id: The ID of the body used in replay files
    :param body_paint: The color of the paint applied to the body
    """
    body = body_dao.get_by_replay_id(body_id)

    if body is None:
        raise NotFoundException('Body not found')

    if body.chassis_base is None:
        raise NotFoundException(
            'Body has no chassis textures. This is most likely because the chassis is not paintable.')

    texture = ChassisTexture(
        get_asset_url(body.chassis_base),
        get_asset_url(body.chassis_n),
        body_paint
    )

    texture.load()
    texture.update()

    image = Image.fromarray(texture.data)

    return serve_pil_image(image)
