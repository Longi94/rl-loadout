import logging
import time
from PIL import Image, ImageChops
from entity import Body
from utils.color import int_to_rgb_array
from utils.network import get_asset_url, load_pil_image
from textures.utils import create_windows_image

log = logging.getLogger(__name__)


def get_eggplant_body_texture(body: Body, color: int):
    rgba_map = load_pil_image(get_asset_url(body.blank_skin))
    base = Image.new('RGBA', rgba_map.size, 0x111111)

    start = time.time()

    alpha = rgba_map.getchannel('A')
    alpha = ImageChops.invert(alpha)

    color_img = Image.new('RGBA', base.size, int_to_rgb_array(color))
    color_img.putalpha(alpha)

    windows_img = create_windows_image(rgba_map)

    base.paste(color_img, (0, 0), color_img)
    base.paste(windows_img, (0, 0), windows_img)

    log.info(f'Texture generation took {time.time() - start} seconds.')

    return base
