import requests
import argparse
import os
import urllib.request
from subprocess import Popen, PIPE

parser = argparse.ArgumentParser()
parser.add_argument('--bucket', '-b', type=str)
args = parser.parse_args()

url = f'https://www.googleapis.com/storage/v1/b/{args.bucket}/o'

objects = requests.get(url).json()['items']
objects = list(
    filter(lambda x: x['name'].startswith('models/') and x['name'].endswith('.glb') and len(x['name']) > 7, objects))

if not os.path.exists('models'):
    os.makedirs('models')
if not os.path.exists('draco'):
    os.makedirs('draco')

for obj in objects:
    print(f'Downloading {obj["name"]}...')
    urllib.request.urlretrieve(obj['mediaLink'], obj['name'])
    command = f'gltf-pipeline -i {obj["name"]} -o {obj["name"].replace("models/", "draco/")} -d'
    print(f'Running {command}')

    p = Popen(command, stdout=PIPE, shell=True)
    for line in p.stdout:
        print(line.decode("utf-8"), end='')
    p.wait()

    if p.returncode != 0:
        print(f'gltf-pipeline returned with non-zero exit code: {p.returncode}')
