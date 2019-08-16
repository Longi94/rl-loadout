from .rgba_map import RgbaMap
from utils.color import int_to_rgb_array


class BodyTexture(RgbaMap):

    def __init__(self, base_texture_url, rgba_map_url, primary, body_paint):
        super(BodyTexture, self).__init__(base_texture_url, rgba_map_url)
        self.primary = int_to_rgb_array(primary)
        self.body_paint = int_to_rgb_array(body_paint)

        self.color_holder = [0, 0, 0, 255]

    def get_color(self, i: int, j: int):
        if self.base_texture is not None:
            self.color_holder[0] = self.base_texture[i, j, 0]
            self.color_holder[1] = self.base_texture[i, j, 1]
            self.color_holder[2] = self.base_texture[i, j, 2]
        else:
            self.color_holder[0] = 0
            self.color_holder[1] = 0
            self.color_holder[2] = 0

        if self.rgba_map is not None:
            if self.rgba_map[i, j, 2] == 255:
                return [0, 0, 0, 255]

            if self.rgba_map[i, j, 0] > 150:
                return self.primary
            elif self.body_paint is not None:
                return self.body_paint

        return self.color_holder
