from rocket.team import TEAM_ORANGE
from utils.network import load_pil_image, get_asset_url


def get_slime_body_texture(team: int):
    if team == TEAM_ORANGE:
        image = load_pil_image(get_asset_url('textures/Body_Slime1_D.tga'))
    else:
        image = load_pil_image(get_asset_url('textures/Body_Slime2_D.tga'))

    return image


def get_slime_chassis_texture(team: int):
    if team == TEAM_ORANGE:
        image = load_pil_image(get_asset_url('textures/Chassis_Slime_D.tga'))
    else:
        image = load_pil_image(get_asset_url('textures/Chassis_Slime2_D.tga'))

    return image
