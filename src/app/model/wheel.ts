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
}
