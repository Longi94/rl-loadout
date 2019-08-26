import numpy as np
from PIL import Image
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
        self.base_texture = load_pil_image(self.base_texture_url)
        self.rgba_map = load_pil_image(self.rgba_map_url)

    def update(self):
        raise NotImplementedError("Please Implement this method")

    def to_pil_image(self):
        return Image.fromarray(self.data)
