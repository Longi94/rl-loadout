import { Item } from './item';
import { Quality } from './quality';

export class Antenna extends Item {

  static NONE = new Antenna(
    -1, '', 'None', Quality.COMMON, false, undefined, undefined, undefined, undefined
  );

  model: string;
  base_texture: string;
  rgba_map: string;
  stick: string;
  stick_id: number;

  constructor(id: number, icon: string, name: string, quality: Quality, paintable: boolean, model: string,
              base_texture: string, rgba_map: string, stick: string) {
    super(id, icon, name, quality, paintable);
    this.model = model;
    this.base_texture = base_texture;
    this.rgba_map = rgba_map;
    this.stick = stick;
  }
}

export class AntennaStick {
  id: number;
  model: string;
}
