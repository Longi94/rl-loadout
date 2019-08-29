import logging
import time
import numpy as np
from PIL import Image, ImageChops
from entity import Body
from utils.color import int_to_rgb_array
from utils.network import get_asset_url, load_pil_image

log = logging.getLogger(__name__)


def get_feline_body_texture(body: Body, color: int):
    base = load_pil_image(get_asset_url(body.base_skin))
    rgba_map = load_pil_image(get_asset_url(body.blank_skin))

    start = time.time()

    red = rgba_map.getchannel('R')
    green = rgba_map.getchannel('G')

    # remove reds that are less then 150
    red_data = np.array(red.getdata())
    red_data[red_data < 42] = 0
    red.putdata(red_data)

    body_img = Image.new('RGBA', base.size, 'black')
    body_img.putalpha(red)

    alpha = rgba_map.getchannel('A')
    alpha = ImageChops.invert(alpha)

    color_img = Image.new('RGBA', base.size, int_to_rgb_array(color))
    color_img.putalpha(alpha)

    back_light_img = Image.new('RGBA', base.size, int_to_rgb_array(0x7f0000))
    back_light_img.putalpha(green)

    base.paste(body_img, (0, 0), body_img)
    base.paste(color_img, (0, 0), color_img)
    base.paste(back_light_img, (0, 0), back_light_img)

    log.info(f'Texture generation took {time.time() - start} seconds.')

    return base
