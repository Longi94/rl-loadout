import { Item } from "./item";
import { Quality } from "./quality";

export class Decal extends Item {
  texture: string;
  paintable: boolean;

  constructor(id: number, icon: string, name: string, quality: Quality, texture: string, paintable: boolean) {
    super(id, icon, name, quality);
    this.texture = texture;
    this.paintable = paintable;
  }
}
