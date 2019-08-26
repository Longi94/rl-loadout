import numpy as np
from utils.network import load_pil_image

MAX_SIZE = 2048


class RgbaMap(object):

    def __init__(self, base_texture_url: str, rgba_map_url: str):
        self.base_texture_url: str = base_texture_url
        self.rgba_map_url: str = rgba_map_url

        self.base_texture = None
        self.rgba_map = None
        self.data = None

    def load(self):
        base_texture_img = load_pil_image(self.base_texture_url)
        rgba_map_img = load_pil_image(self.rgba_map_url)

        if base_texture_img is not None:
            self.base_texture = np.array(base_texture_img)

        if rgba_map_img is not None:
            self.rgba_map = np.array(rgba_map_img)

    def update(self):
        raise NotImplementedError("Please Implement this method")
