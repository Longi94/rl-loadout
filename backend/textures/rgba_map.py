import requests
import io
import numpy as np
from PIL import Image

MAX_SIZE = 1028


class RgbaMap(object):

    def __init__(self, base_texture_url: str, rgba_map_url: str):
        self.base_texture_url: str = base_texture_url
        self.rgba_map_url: str = rgba_map_url

        self.base_texture = None
        self.rgba_map = None
        self.data = None

    def load(self):
        base_texture_img = load_image(self.base_texture_url)
        rgba_map_img = load_image(self.rgba_map_url)

        if base_texture_img is not None:
            self.base_texture = np.array(base_texture_img)

        if rgba_map_img is not None:
            self.rgba_map = np.array(rgba_map_img)

        if self.base_texture is not None:
            self.data = np.uint8(np.zeros(self.base_texture.shape))
        else:
            self.data = np.uint8(np.zeros((MAX_SIZE, MAX_SIZE, 4)))

    def update(self):
        for i, j in np.ndindex(self.data.shape[:2]):
            color = self.get_color(i, j)
            self.data[i, j, 0] = color[0]
            self.data[i, j, 1] = color[1]
            self.data[i, j, 2] = color[2]
            self.data[i, j, 3] = color[3] if len(color) > 3 else 255

    def get_color(self, i: int, j: int):
        raise NotImplementedError("Please Implement this method")


def load_image(url: str):
    if url is None:
        return None
    r = requests.get(url)
    image = Image.open(io.BytesIO(r.content))

    if image.width >= image.height and image.width > MAX_SIZE:
        new_width = MAX_SIZE
        new_height = int((MAX_SIZE / image.width) * image.height)
        image = image.resize((new_width, new_height), Image.ANTIALIAS)
    elif image.height > MAX_SIZE:
        new_width = int((MAX_SIZE / image.height) * image.width)
        new_height = MAX_SIZE
        image = image.resize((new_width, new_height), Image.ANTIALIAS)

    return image.convert('RGBA')
