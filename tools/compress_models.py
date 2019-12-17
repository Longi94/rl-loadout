import argparse
import os
from subprocess import Popen, PIPE

parser = argparse.ArgumentParser()
parser.add_argument('--dir', '-d', type=str, required=True)
args = parser.parse_args()

if not os.path.exists('draco'):
    os.makedirs('draco')

for file in filter(lambda x: x.endswith('.glb'), os.listdir(args.dir)):
    command = f'gltf-pipeline -i {os.path.join(args.dir, file)} -o {os.path.join("draco", file)} -d'
    print(f'Running {command}')

    p = Popen(command, stdout=PIPE, shell=True)
    for line in p.stdout:
        print(line.decode("utf-8"), end='')
    p.wait()

    if p.returncode != 0:
        print(f'gltf-pipeline returned with non-zero exit code: {p.returncode}')
