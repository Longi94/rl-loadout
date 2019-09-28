# Export and convert all thumbnails

import argparse
import os
from PIL import Image
from subprocess import Popen, PIPE


def umodel_extract(path, file):
    print(f'Extracting {file}...')
    command = ['umodel', '-game=rocketleague', f'-path={path}', '-export', file]
    print(f'Running {" ".join(command)}')
    p = Popen(command, stdout=PIPE)
    for line in p.stdout:
        print(line.decode("utf-8"), end='')
    p.wait()

    if p.returncode != 0:
        print(f'umodel returned with non-zero exit code: {p.returncode}')


def convert_to_jpeg(path, file):
    print(f'Converting {os.path.join(path, file)}...')
    im = Image.open(os.path.join(path, file))
    rgb_im = im.convert('RGB')
    rgb_im.save(os.path.join('thumbnails', file.replace('.tga', '.jpg')))


parser = argparse.ArgumentParser()
parser.add_argument('--input', '-i', type=str, help='Path to game files', required=True)
args = parser.parse_args()

files = os.listdir(args.input)

for file in filter(lambda x: x.endswith('_T_SF.upk'), files):
    umodel_extract(args.input, file)

os.mkdir('thumbnails')

for root, subdirs, files in os.walk('UmodelExport'):
    for file in files:
        if file.lower().endswith('thumbnail.tga'):
            convert_to_jpeg(root, file)
