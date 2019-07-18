import { Item } from "./item";
import { Quality } from "./quality";

export class Wheel extends Item {
  model: string;
  rimTexture: string;
  rgbaMap: string;
  paintable: boolean;

  constructor(icon: string, name: string, quality: Quality, model: string, rimTexture: string, rgbaMap: string,
              paintable: boolean) {
    super(icon, name, quality);
    this.model = model;
    this.rimTexture = rimTexture;
    this.rgbaMap = rgbaMap;
    this.paintable = paintable;
  }
}
