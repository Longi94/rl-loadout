import { Quality } from "./quality";

export class Item {
  id: number;
  icon: string;
  name: string;
  quality: Quality;

  constructor(id: number, icon: string, name: string, quality: Quality) {
    this.id = id;
    this.icon = icon;
    this.name = name;
    this.quality = quality;
  }
}
