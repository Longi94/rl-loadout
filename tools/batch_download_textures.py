import requests
import argparse
import os
import urllib.request

parser = argparse.ArgumentParser()
parser.add_argument('--bucket', '-b', type=str, required=True)
args = parser.parse_args()

url = f'https://www.googleapis.com/storage/v1/b/{args.bucket}/o'

objects = requests.get(url).json()['items']
objects = list(
    filter(lambda x: x['name'].startswith('textures/') and x['name'].endswith('.tga') and
                     not x['name'].endswith('_small.tga') and len(x['name']) > 9, objects))

if not os.path.exists('textures'):
    os.makedirs('textures')

for obj in objects:
    print(f'Downloading {obj["name"]}...')
    urllib.request.urlretrieve(obj['mediaLink'], obj['name'])
