from dao import BodyDao
from textures.chassis_texture import generate_chassis_texture
from utils.network import get_asset_url, serve_pil_image
from utils.network.exc import NotFoundException
from textures.custom import handle_custom_chassis_texture

body_dao = BodyDao()


def get(body_id: int, body_paint: int = None, team: int = None):
    """
    :param body_id: The ID of the body used in replay files
    :param body_paint: The color of the paint applied to the body
    :param team: Used when the chassis has different textures for the teams (e.g. Jurassic Jeep)
    """
    body = body_dao.get(body_id)

    if body is None:
        raise NotFoundException('Body not found')

    image = handle_custom_chassis_texture(body, body_paint, team)

    if image is not None:
        return serve_pil_image(image)

    if body.chassis_base is None:
        raise NotFoundException(
            'Body has no chassis textures. This is most likely because the chassis is not paintable.')

    image = generate_chassis_texture(
        get_asset_url(body.chassis_base),
        get_asset_url(body.chassis_n),
        body_paint
    )

    return serve_pil_image(image)
