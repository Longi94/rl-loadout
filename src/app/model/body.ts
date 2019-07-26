import { Item } from "./item";
import { Quality } from "./quality";

export class Body extends Item {
  blank_skin: string;
  base_skin: string;
  model: string;
  topper_pos_x: number;
  topper_pos_y: number;
  topper_pos_z: number;
  topper_rot_x: number;
  topper_rot_y: number;
  topper_rot_z: number;
}
