import { Item } from "./item";
import { Quality } from "./quality";

export class Wheel extends Item {
  model: string;
  rim_base: string;
  rim_rgb_map: string;

  constructor(id: number, icon: string, name: string, quality: Quality, model: string, rim_base: string, rim_rgb_map: string,
              paintable: boolean) {
    super(id, icon, name, quality, paintable);
    this.model = model;
    this.rim_base = rim_base;
    this.rim_rgb_map = rim_rgb_map;
  }

  static DEFAULT = new Wheel(
    0,
    'icons/Wheel_Star_Thumbnail.jpg',
    'OEM',
    Quality.COMMON,
    'models/WHEEL_Star_SM.glb',
    'textures/OEM_D.tga',
    'textures/OEM_RGB.tga',
    true
  )
}
