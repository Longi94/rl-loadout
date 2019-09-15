import logging
import time
import numpy as np
from PIL import Image
from entity import Body
from utils.color import int_to_rgb_array
from utils.network import get_asset_url, load_pil_image

log = logging.getLogger(__name__)


def get_grey_car_body_texture(body: Body, color: int):
    base = load_pil_image(get_asset_url(body.base_skin))
    rgba_map = load_pil_image(get_asset_url(body.blank_skin))

    start = time.time()

    red = rgba_map.getchannel('R')
    alpha = rgba_map.getchannel('A')

    red_data = np.array(red.getdata())
    red_data[red_data < 42] = 0
    red.putdata(red_data)

    color_img = Image.new('RGBA', base.size, int_to_rgb_array(color))
    color_img.putalpha(red)

    body_img = Image.new('RGBA', base.size, 0x545454)
    body_img.putalpha(alpha)

    base.paste(color_img, (0, 0), color_img)
    base.paste(body_img, (0, 0), body_img)

    log.info(f'Texture generation took {time.time() - start} seconds.')

    return base
