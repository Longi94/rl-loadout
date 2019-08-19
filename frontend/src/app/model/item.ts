import { Quality } from './quality';

export class Item {
  id: number;
  icon: string;
  name: string;
  quality: Quality;
  paintable: boolean;

  constructor(id: number, icon: string, name: string, quality: Quality, paintable: boolean) {
    this.id = id;
    this.icon = icon;
    this.name = name;
    this.quality = quality;
    this.paintable = paintable;
  }
}
