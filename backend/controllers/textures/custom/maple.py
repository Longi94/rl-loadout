from rocket.team import TEAM_ORANGE
from utils.network import load_pil_image, get_asset_url, serve_pil_image


def get_maple_body_texture(team: int):
    if team == TEAM_ORANGE:
        image = load_pil_image(get_asset_url('textures/Body_Maple1_D.tga'))
    else:
        image = load_pil_image(get_asset_url('textures/Body_Maple2_D.tga'))

    return serve_pil_image(image)


def get_maple_chassis_texture(team: int):
    if team == TEAM_ORANGE:
        image = load_pil_image(get_asset_url('textures/Chassis_Maple1_D.tga'))
    else:
        image = load_pil_image(get_asset_url('textures/Chassis_Maple2_D.tga'))

    return serve_pil_image(image)
