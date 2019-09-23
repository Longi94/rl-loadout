import time
import logging
import numpy as np
from PIL import Image
from .consts import MAX_SIZE
from utils.color import int_to_rgb_array
from utils.network import load_pil_image

log = logging.getLogger(__name__)


def generate_chassis_texture(base_texture_url: str, rgba_map_url: str, body_paint: int, accent: int = 0):
    base_texture = load_pil_image(base_texture_url)
    rgba_map = load_pil_image(rgba_map_url)

    start = time.time()

    if base_texture is None:
        base_texture = Image.new('RGBA', (MAX_SIZE, MAX_SIZE))

    alpha = base_texture.getchannel('A')
    alpha_data = np.array(alpha.getdata())
    has_accent_map = alpha_data[alpha_data < 255].any()

    base_texture.putalpha(255)

    if rgba_map is not None:
        red = rgba_map.getchannel('R')
        body_paint_img = Image.new('RGBA', base_texture.size, color=int_to_rgb_array(body_paint))
        body_paint_img.putalpha(red)
        base_texture.paste(body_paint_img, (0, 0), body_paint_img)
    if has_accent_map:
        accent_img = Image.new('RGBA', base_texture.size, accent)
        accent_img.putalpha(alpha)
        base_texture.paste(accent_img, (0, 0), accent_img)

    log.info(f'Texture generation took {time.time() - start} seconds.')

    return base_texture
