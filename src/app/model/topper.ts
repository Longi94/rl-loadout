import { Item } from "./item";
import { Quality } from "./quality";

export class Topper extends Item{
  base_texture: string;
  rgba_map: string;


  constructor(id: number, icon: string, name: string, quality: Quality, paintable: boolean, base_texture: string, rgba_map: string) {
    super(id, icon, name, quality, paintable);
    this.base_texture = base_texture;
    this.rgba_map = rgba_map;
  }

  static NONE = new Topper(
    -1, '', 'None', Quality.COMMON, false, undefined, undefined
  );
}
