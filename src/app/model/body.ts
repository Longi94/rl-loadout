import { Item } from "./item";
import { Quality } from "./quality";

export class Body extends Item {
  blank_skin: string;
  chassis_base: string;
  chassis_rgb_map: string;
  displacement_map: string;
  model: string;
  topper_pos_x: number;
  topper_pos_y: number;
  topper_pos_z: number;
  topper_rot_x: number;
  topper_rot_y: number;
  topper_rot_z: number;

  constructor(id: number,
              icon: string,
              name: string,
              quality: Quality,
              paintable: boolean,
              blank_skin: string,
              chassis_base: string,
              chassis_rgb_map: string,
              displacement_map: string,
              model: string,
              topper_pos_x: number,
              topper_pos_y: number,
              topper_pos_z: number,
              topper_rot_x: number,
              topper_rot_y: number,
              topper_rot_z: number) {
    super(id, icon, name, quality, paintable);
    this.blank_skin = blank_skin;
    this.chassis_base = chassis_base;
    this.chassis_rgb_map = chassis_rgb_map;
    this.displacement_map = displacement_map;
    this.model = model;
    this.topper_pos_x = topper_pos_x;
    this.topper_pos_y = topper_pos_y;
    this.topper_pos_z = topper_pos_z;
    this.topper_rot_x = topper_rot_x;
    this.topper_rot_y = topper_rot_y;
    this.topper_rot_z = topper_rot_z;
  }

  static DEFAULT: Body = new Body(
    1,
    'icons/Body_MuscleCar_Thumbnail.jpg',
    'Dominus',
    Quality.PREMIUM,
    false,
    'textures/MuscleCar_BlankSkin_RGB.tga',
    'textures/MuscleCar_Chassis_D.tga',
    'textures/MuscleCar_Chassis_RGB.tga',
    'textures/MuscleCar_Body_Curvature.tga',
    'models/Body_Dominus_PremiumSkin_SK.glb',
    0,
    0,
    0,
    0,
    0,
    0
  );
}