import { Color } from "three";
import { overBlendColors } from "../utils/color";
import { RgbaMapPipe } from "./rgba-map-pipe";

export class StaticSkin extends RgbaMapPipe {

  primary: Color = new Color(0, 0, 1);
  accent: Color = new Color(1, 1, 1);
  paint: Color = new Color(1, 0, 0);

  constructor(rgbaMapUrl, paints) {
    super(undefined, rgbaMapUrl);

    this.primary = new Color(paints.primary);
    this.accent = new Color(paints.accent);
    this.paint = new Color(paints.decal);
  }

  update() {
    for (let i = 0; i < this.data.length; i += 4) {
      let color = new Color(0, 0, 0);

      if (this.rgbaMap[i] == 255 && this.rgbaMap[i + 2] == 0) {
        color = this.primary;

        if (this.rgbaMap[i + 3] > 0) {
          color = overBlendColors(this.accent, this.primary, this.rgbaMap[i + 3]);
        }

        if (this.rgbaMap[i + 1] > 0) {
          color = overBlendColors(this.paint, this.primary, this.rgbaMap[i + 3]);
        }
      }

      this.data[i] = color.r * 255;
      this.data[i + 1] = color.g * 255;
      this.data[i + 2] = color.b * 255;
      this.data[i + 3] = 255;
    }
  }
}
