import time
import logging
import numpy as np
from PIL import Image
from . import MAX_SIZE
from utils.color import int_to_rgb_array
from utils.network import load_pil_image

log = logging.getLogger(__name__)


def generate_body_texture(base_texture_url: str, rgba_map_url: str, primary: int, body_paint: int):
    base_texture = load_pil_image(base_texture_url)
    rgba_map = load_pil_image(rgba_map_url)

    start = time.time()

    if base_texture is None:
        base_texture = Image.new('RGBA', (MAX_SIZE, MAX_SIZE))

    if body_paint is not None:
        # start with the body paint color
        base_texture.paste(int_to_rgb_array(body_paint), (0, 0, base_texture.size[0], base_texture.size[1]))

    if rgba_map is not None:
        red = rgba_map.getchannel('R')
        blue = rgba_map.getchannel('B')

        # remove reds that are less then 150
        red_data = np.array(red.getdata())
        red_data[red_data < 150] = 0
        red.putdata(red_data)

        primary_img = Image.new('RGBA', base_texture.size, color=int_to_rgb_array(primary))
        primary_img.putalpha(red)

        windows_img = Image.new('RGBA', base_texture.size, color='black')
        windows_img.putalpha(blue)

        base_texture.paste(primary_img, (0, 0), primary_img)
        base_texture.paste(windows_img, (0, 0), windows_img)

    log.info(f'Texture generation took {time.time() - start} seconds.')

    return base_texture
