import argparse
import os
from PIL import Image

parser = argparse.ArgumentParser()
parser.add_argument('--dir', '-d', type=str, required=True)
args = parser.parse_args()

if not os.path.exists('converted'):
    os.makedirs('converted')

for file in filter(lambda x: x.endswith('.tga'), os.listdir(args.dir)):
    print(f'Processing {file}...')
    image = Image.open(os.path.join(args.dir, file))

    image.save(os.path.join('converted', file.replace('.tga', '.png')))
    image.thumbnail((image.size[0] / 2, image.size[1] / 2), Image.LANCZOS)
    image.save(os.path.join('converted', file.replace('.tga', '_S.tga')))
    image.save(os.path.join('converted', file.replace('.tga', '_S.png')))
