# noinspection PyUnresolvedReferences
import bpy
import os
import re
import math
from mathutils import Vector, Euler

bl_info = {
    'name': 'Rocket Loadout Blender Add-on',
    'version': (1, 0, 0),
    'blender': (2, 80, 0),
    'location': 'File > Import > Unreal Script Sockets',
    'wiki_url': 'https://github.com/Longi94/rl-loadout',
    'category': 'Import-Export'
}

socket_regex = re.compile('#exec MESH ATTACHNAME {2}'
                          'MESH=(?P<mesh>[a-zA-Z0-9_ ]+) '
                          'BONE="(?P<bone>[a-zA-Z0-9_ ]+)" '
                          'TAG="(?P<tag>[a-zA-Z0-9_ ]+)" '
                          'YAW=(?P<yaw>[0-9]+) '
                          'PITCH=(?P<pitch>[0-9]+) '
                          'ROLL=(?P<roll>[0-9]+) '
                          'X=(?P<x>-?[0-9]+(\.[0-9]+(e-?[0-9]+)?)?) '
                          'Y=(?P<y>-?[0-9]+(\.[0-9]+(e-?[0-9]+)?)?) '
                          'Z=(?P<z>-?[0-9]+(\.[0-9]+(e-?[0-9]+)?)?)')
rotator_regex = re.compile('\/\/ rotator: P=(?P<pitch>[0-9]+) Y=(?P<yaw>[0-9]+) R=(?P<roll>[0-9]+)')


def rotator_to_deg(rot):
    return (rot / 65536.0) * 2 * math.pi


# Recursively transverse layer_collection for a particular name
def find_layer_collection(layer_collection, name):
    found = None
    if layer_collection.name == name:
        return layer_collection
    for layer in layer_collection.children:
        found = find_layer_collection(layer, name)
        if found:
            return found


def set_active_collection(name):
    layer_collection = bpy.context.view_layer.layer_collection
    layer_collection = find_layer_collection(layer_collection, name)
    bpy.context.view_layer.active_layer_collection = layer_collection


class ImportSockets(bpy.types.Operator):
    """Import sockets from n Unreal Script for a Rocket League model"""
    bl_idname = 'import_scene.rl_sockets'
    bl_label = 'Import Unreal Script Sockets'
    bl_options = {'UNDO'}

    filepath: bpy.props.StringProperty(subtype='FILE_PATH')
    filter_glob: bpy.props.StringProperty(default='*.uc', options={'HIDDEN'})

    def execute(self, context):
        with open(self.filepath, 'r') as f:
            lines = f.readlines()

        if 'Sockets' not in bpy.data.collections:
            sockets = bpy.data.collections.new('Sockets')
        else:
            sockets = bpy.data.collections['Sockets']

        if 'Sockets' not in context.scene.collection.children:
            context.scene.collection.children.link(sockets)

        set_active_collection('Sockets')

        for i, line in enumerate(lines):
            match = socket_regex.match(line.strip())
            if match:
                rotator_match = rotator_regex.match(lines[i + 1])

                mesh_name = match.group('mesh')
                bone_name = match.group('bone')
                tag = match.group('tag')
                x = float(match.group('x'))
                y = float(match.group('y'))
                z = float(match.group('z'))

                mesh = context.scene.objects[mesh_name + '.ao']
                bone = mesh.data.bones[bone_name]
                socket_location = mesh.location + bone.head_local + Vector((x, -y, z))

                pitch = rotator_to_deg(float(rotator_match.group('pitch')))
                yaw = rotator_to_deg(float(rotator_match.group('yaw')))
                roll = rotator_to_deg(float(rotator_match.group('roll')))
                rotation = Euler((roll, -pitch, yaw), 'XYZ')

                rotation.rotate(mesh.rotation_euler)
                rotation.rotate(bone.matrix)

                bpy.ops.object.empty_add(type='CUBE', location=socket_location[:], rotation=rotation[:])
                bpy.context.active_object.name = tag

        return {'FINISHED'}

    def invoke(self, context, event):
        context.window_manager.fileselect_add(self)
        return {'RUNNING_MODAL'}


def menu_import_draw(self, context):
    self.layout.operator(ImportSockets.bl_idname, text="Unreal Script Sockets")


def register():
    bpy.utils.register_class(ImportSockets)
    bpy.types.TOPBAR_MT_file_import.append(menu_import_draw)


def unregister():
    bpy.utils.unregister_class(ImportSockets)
    bpy.types.TOPBAR_MT_file_import.remove(menu_import_draw)


if __name__ == '__main__':
    register()
