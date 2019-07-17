import { Item } from "./item";
import { Quality } from "./quality";

export class Decal extends Item {
  texture: string;
  paintable: boolean;

  constructor(icon: string, name: string, quality: Quality, texture: string, paintable: boolean) {
    super(icon, name, quality);
    this.texture = texture;
    this.paintable = paintable;
  }
}
