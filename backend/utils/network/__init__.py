import requests
from config import config
from io import BytesIO
from flask import send_file
from PIL import Image


def log_endpoints(log, app):
    log.info(f'Registered {len(list(app.url_map.iter_rules()))} endpoints:')
    for rule in app.url_map.iter_rules():
        log.info(f'[{rule.methods}] {rule.rule} -> {rule.endpoint}')


def get_asset_url(path: str) -> str or None:
    if path is None:
        return None

    return f'{config.get("assets", "host")}/{path}'


def serve_pil_image(image):
    if image.mode in ('RGBA', 'LA'):
        background = Image.new(image.mode[:-1], image.size, 0)
        background.paste(image, image.split()[-1])
        image = background
    img_io = BytesIO()
    image.save(img_io, 'JPEG', quality=90)
    img_io.seek(0)
    return send_file(img_io, mimetype='image/jpeg')


def load_pil_image(url: str):
    if url is None:
        return None
    r = requests.get(url)
    image = Image.open(BytesIO(r.content))

    return image.convert('RGBA')
