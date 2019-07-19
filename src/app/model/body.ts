import { Item } from "./item";

export class Body extends Item {
  blank_skin: string;
  chassis_base: string;
  chassis_rgb_map: string;
  id: number;
  model: string;
  replay_id?: string;
  topper_pos_x: number;
  topper_pos_y: number;
  topper_pos_z: number;
  topper_rot_x: number;
  topper_rot_y: number;
  topper_rot_z: number;
}
