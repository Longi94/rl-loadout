import time
import logging
import numpy as np
from .rgba_map import RgbaMap, MAX_SIZE
from utils.color import int_to_rgb_array

log = logging.getLogger(__name__)


class ChassisTexture(RgbaMap):

    def __init__(self, base_texture_url, rgba_map_url, body_paint):
        super(ChassisTexture, self).__init__(base_texture_url, rgba_map_url)
        self.body_paint = int_to_rgb_array(body_paint)

    def update(self):
        start = time.time()
        if self.base_texture is not None:
            self.data = np.uint8(self.base_texture)
        else:
            self.data = np.uint8(np.zeros((MAX_SIZE, MAX_SIZE, 4)))

        if self.rgba_map is not None:
            red, green, blue, alpha = self.rgba_map.T

            if self.body_paint:
                self.data[(red > 230).T] = self.body_paint

        log.info(f'Texture generation took {time.time() - start} seconds.')
