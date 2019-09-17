import time
import logging
import numpy as np
from PIL import Image
from .consts import MAX_SIZE
from utils.color import int_to_rgb_array
from utils.network import load_pil_image

log = logging.getLogger(__name__)


def generate_body_texture(base_texture_url: str, rgba_map_url: str, decal_base_url: str, decal_rgba_map_url: str,
                          primary: int, accent: int, body_paint: int, decal_paint: int):
    base_texture = load_pil_image(base_texture_url)
    rgba_map = load_pil_image(rgba_map_url)
    decal_base = load_pil_image(decal_base_url)
    decal_rgba = load_pil_image(decal_rgba_map_url)

    start = time.time()

    if base_texture is None:
        base_texture = Image.new('RGBA', (MAX_SIZE, MAX_SIZE))

    if body_paint is not None:
        # start with the body paint color
        base_texture.paste(int_to_rgb_array(body_paint), (0, 0, base_texture.size[0], base_texture.size[1]))

    if rgba_map is not None:
        red = rgba_map.getchannel('R')

        # remove reds that are less then 150
        red_data = np.array(red.getdata())
        red_data[red_data < 150] = 0
        red.putdata(red_data)

        primary_img = Image.new('RGBA', base_texture.size, color=int_to_rgb_array(primary))
        primary_img.putalpha(red)

        base_texture.paste(primary_img, (0, 0), primary_img)

    if decal_rgba is not None:
        decal_mask = decal_rgba.getchannel('A')
        decal_img = Image.new('RGBA', base_texture.size, accent)
        decal_img.putalpha(decal_mask)
        base_texture.paste(decal_img, (0, 0), decal_img)

        if decal_paint is not None:
            decal_paint_mask = decal_rgba.getchannel('G')
            decal_paint_img = Image.new('RGBA', base_texture.size, decal_paint)
            decal_paint_img.putalpha(decal_paint_mask)
            base_texture.paste(decal_paint_img, (0, 0), decal_paint_img)

    if rgba_map is not None:
        green = rgba_map.getchannel('G')
        accent_img = Image.new('RGBA', base_texture.size, accent)
        accent_img.putalpha(green)

        base_texture.paste(accent_img, (0, 0), accent_img)

    log.info(f'Texture generation took {time.time() - start} seconds.')

    return base_texture
