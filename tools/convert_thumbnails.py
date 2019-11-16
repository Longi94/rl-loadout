# Export and convert all thumbnails

import argparse
import os
from PIL import Image


def convert_to_jpeg(file, output):
    print(f'Converting {file}...')
    im = Image.open(file)
    rgb_im = im.convert('RGB')
    rgb_im.save(output)


parser = argparse.ArgumentParser()
parser.add_argument('-d', '--directory', type=str, required=True)
parser.add_argument('-o', '--output', type=str, required=True)
args = parser.parse_args()

os.makedirs(args.output)

for directory in os.listdir(args.directory):
    directory = os.path.join(args.directory, directory)
    if not os.path.isdir(directory):
        continue

    if not directory.endswith('_T_SF'):
        continue

    for file in os.listdir(os.path.join(directory, 'Texture2D')):
        if file.endswith('.tga'):
            convert_to_jpeg(os.path.join(directory, 'Texture2D', file),
                            os.path.join(args.output, file.replace('.tga', '.jpg')))
