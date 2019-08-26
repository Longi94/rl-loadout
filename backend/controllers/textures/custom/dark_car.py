import logging
import time
from PIL import Image, ImageChops
from entity import Body
from utils.color import int_to_rgb_array
from utils.network import get_asset_url, serve_pil_image, load_pil_image

log = logging.getLogger(__name__)


def get_dark_car_body_texture(body: Body, color: int):
    base = load_pil_image(get_asset_url(body.base_skin))
    rgba_map = load_pil_image(get_asset_url(body.blank_skin))

    start = time.time()

    green = rgba_map.getchannel('G')
    alpha = rgba_map.getchannel('A')

    green = ImageChops.invert(green)
    alpha = ImageChops.invert(alpha)

    color_img = Image.new('RGBA', base.size, int_to_rgb_array(color))
    color_img.putalpha(alpha)

    shadows_img = Image.new('RGBA', base.size, 0)
    shadows_img.putalpha(green)

    base.paste(shadows_img, (0, 0), shadows_img)
    base.paste(color_img, (0, 0), color_img)

    log.info(f'Texture generation took {time.time() - start} seconds.')

    return serve_pil_image(base)
