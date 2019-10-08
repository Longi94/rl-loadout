/* tslint:disable:variable-name */

import { Item } from './item';
import { Vector3 } from 'three';
import { BASE_WHEEL_MESH_RADIUS, BASE_WHEEL_MESH_WIDTH } from '../3d/constants';

export class Wheel extends Item {
  model: string;
  rim_base: string;
  rim_rgb_map: string;
}

export class WheelConfig {
  right: boolean;
  front: boolean;
  position: Vector3;
  width: number = BASE_WHEEL_MESH_WIDTH;
  radius: number = BASE_WHEEL_MESH_RADIUS;
  offset = 0;

  clone(): WheelConfig {
    const newObj = new WheelConfig();

    newObj.right = this.right;
    newObj.front = this.front;
    newObj.width = this.width;
    newObj.radius = this.radius;
    newObj.offset = this.offset;
    newObj.position = new Vector3();
    newObj.position.copy(this.position);

    return newObj;
  }
}
