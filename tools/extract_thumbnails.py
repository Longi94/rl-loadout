import os
import argparse
import subprocess
from multiprocessing.pool import ThreadPool
from functools import partial
from PIL import Image


def umodel_extract(path, file):
    print(f'Extracting {file}...')
    command = ['umodel', '-game=rocketleague', f'-path={path}', '-export', file]
    print(f'Running {" ".join(command)}')
    p = subprocess.Popen(command, stdout=subprocess.PIPE)
    for line in p.stdout:
        print(line.decode("utf-8"), end='')
    p.wait(timeout=600)

    if p.returncode != 0:
        print(f'umodel returned with non-zero exit code: {p.returncode}')

    return p.returncode == 0


def process_file(file, args, existing):
    output_dir = file.replace('_T_SF.upk', '')

    try:
        output_dir = next(x for x in existing if x.lower() == output_dir.lower())
    except StopIteration:
        return

    output_dir = os.path.join(args.output, output_dir)

    os.makedirs(output_dir, exist_ok=True)

    if not umodel_extract(args.directory, file):
        return

    texture_folder = os.path.join('UmodelExport', os.path.splitext(file)[0], 'Texture2D')
    if not os.path.exists(texture_folder):
        return

    for texture in os.listdir(texture_folder):
        if texture.endswith('.tga'):
            img = Image.open(os.path.join(texture_folder, texture))
            rgb_im = img.convert('RGB')
            rgb_im.save(os.path.join(output_dir, texture.replace('.tga', '.jpg')))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-d', '--directory', type=str, required=True)
    parser.add_argument('-o', '--output', type=str, required=True)
    parser.add_argument('-f', '--from-item', type=str, required=False)
    args = parser.parse_args()

    files = os.listdir(args.directory)

    if args.from_item is not None:
        files = files[files.index(args.from_item):]

    os.makedirs(args.output, exist_ok=True)

    existing = os.listdir(args.output)

    with ThreadPool(10) as p:
        for _ in p.imap_unordered(partial(process_file, args=args, existing=existing),
                                  filter(lambda x: x.endswith('_T_SF.upk'), files)):
            pass
