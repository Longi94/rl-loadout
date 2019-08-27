from PIL import Image


def create_windows_image(rgba_map):
    """
    Create an image for the window texture. Black where the rgba map blue is 255

    :param rgba_map: rgba map image
    """
    blue = rgba_map.getchannel('B')
    windows_img = Image.new('RGBA', rgba_map.size, color='black')
    windows_img.putalpha(blue)
    return windows_img
