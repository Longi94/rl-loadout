import os
import argparse
import pandas as pd
from pygltflib import GLTF2

SHEETS_URL = 'https://docs.google.com/spreadsheets/d/1ZP_0-xEH_pk2zs4Wfr38NaLYa0vZmB3r5CdMYnfNbEY/export?format=csv&id=1ZP_0-xEH_pk2zs4Wfr38NaLYa0vZmB3r5CdMYnfNbEY&gid=0'

parser = argparse.ArgumentParser()
parser.add_argument('-d', '--directory', type=str, required=True)
args = parser.parse_args()

bodies_df = pd.read_csv(SHEETS_URL, header=[0, 1])

files = list(filter(lambda x: x.lower().startswith('body_') and x.endswith('.glb'), os.listdir(args.directory)))

try:
    os.mkdir(os.path.join(args.directory, 'wheel_props'))
except FileExistsError:
    pass


def row_to_wheel_conf(row):
    return {
        'wheelMeshRadius': row['WheelMeshRadius'].values[0],
        'wheelWidth': row['WheelWidth'].values[0],
        'wheelMeshOffsetSide': row['WheelMeshOffsetSide'].values[0],
        'wheelRadius': row['WheelRadius'].values[0],
        'wheelOffsetForward': row['WheelOffsetForward'].values[0],
        'wheelOffsetSide': row['WheelOffsetSide'].values[0]
    }


for file in files:
    print(f'Handling {file}...')
    gltf = GLTF2().load(os.path.join(args.directory, file))

    row = bodies_df[bodies_df['ProductsDB', 'ProductsDB'].str.lower() == file.replace('_SF.glb', '').lower()]

    front_axle = row_to_wheel_conf(row['FrontAxle'])
    back_axle = row_to_wheel_conf(row['BackAxle'])

    gltf.scenes[0].extras['wheelSettings'] = {
        'frontAxle': front_axle,
        'backAxle': back_axle
    }

    hitbox = {
        'preset': row['HandlingPreset', 'HandlingPreset_TA'].values[0]
    }

    if not row['Hitbox', 'Translation.X'].isna().values[0]:
        hitbox['translationX'] = row['Hitbox', 'Translation.X'].values[0]

    if not row['Hitbox', 'Translation.Z'].isna().values[0]:
        hitbox['translationZ'] = row['Hitbox', 'Translation.Z'].values[0]

    gltf.scenes[0].extras['hitbox'] = hitbox

    gltf.scenes[0].extras.pop('glTF2ExportSettings', None)
    gltf.scenes[0].extras.pop('wheelScale', None)

    gltf.save(os.path.join(args.directory, 'wheel_props', file))