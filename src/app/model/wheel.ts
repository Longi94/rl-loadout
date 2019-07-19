import { Item } from "./item";
import { Quality } from "./quality";

export class Wheel extends Item {
  model: string;
  rimTexture: string;
  rgbaMap: string;
  paintable: boolean;

  constructor(id: number, icon: string, name: string, quality: Quality, model: string, rimTexture: string, rgbaMap: string,
              paintable: boolean) {
    super(id, icon, name, quality);
    this.model = model;
    this.rimTexture = rimTexture;
    this.rgbaMap = rgbaMap;
    this.paintable = paintable;
  }

  static DEFAULT = new Wheel(
    0,
    'icons/Wheel_Star_Thumbnail.jpg',
    'OEM',
    Quality.COMMON,
    'assets/models/wheel_oem.glb',
    'assets/textures/OEM_D.tga',
    'assets/textures/OEM_RGB.tga',
    true
  )
}
