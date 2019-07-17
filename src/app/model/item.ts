import { Quality } from "./quality";

export class Item {
  icon: string;
  name: string;
  quality: Quality;

  constructor(icon: string, name: string, quality: Quality) {
    this.icon = icon;
    this.name = name;
    this.quality = quality;
  }
}
