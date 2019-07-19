import { Color } from "three";
import { BLACK, overBlendColors } from "../utils/color";
import { RgbaMapPipe } from "./rgba-map-pipe";
import { Decal } from "../model/decal";
import { getAssetUrl } from "../utils/network";


export class StaticSkin extends RgbaMapPipe {

  primary: Color = new Color(0, 0, 1);
  accent: Color = new Color(1, 1, 1);
  paint: Color = new Color(1, 0, 0);
  bodyPaint: Color;

  blankSkinMap: Uint8ClampedArray;

  constructor(decal: Decal, paints) {
    super(getAssetUrl(decal.base_texture), getAssetUrl(decal.rgba_map));

    this.primary = new Color(paints.primary);
    this.accent = new Color(paints.accent);
    this.paint = new Color(paints.decal);
    this.bodyPaint = new Color(paints.body);
  }

  getColor(i: number): Color {
    let color = BLACK;

    if (this.blankSkinMap !== undefined) {
      if (this.blankSkinMap[i] > 150) {
        color = this.primary;
      } else if (this.blankSkinMap[i] >= 30 && this.blankSkinMap[i] <= 50) {
        return this.bodyPaint;
      } else {
        return color;
      }
    }

    if (this.rgbaMap === undefined) {
      return color;
    }

    if (this.rgbaMap[i] == 255 && this.rgbaMap[i + 2] == 0) {
      if (this.rgbaMap[i + 3] > 0) {
        color = overBlendColors(this.accent, this.primary, this.rgbaMap[i + 3]);
      }

      if (this.rgbaMap[i + 1] > 0) {
        color = overBlendColors(this.paint, this.primary, this.rgbaMap[i + 3]);
      }
    }

    return color;
  }

  clear() {
    this.base = undefined;
    this.rgbaMap = undefined;
  }
}
