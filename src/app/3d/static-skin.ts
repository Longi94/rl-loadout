import { Color } from "three";
import { BLACK, overBlendColors } from "../utils/color";
import { RgbaMapPipeTexture } from "./rgba-map-pipe-texture";
import { Decal } from "../model/decal";
import { getAssetUrl } from "../utils/network";


export class StaticSkin extends RgbaMapPipeTexture {

  primary: Color;
  accent: Color;
  paint: Color;
  bodyPaint: Color;
  colorHolder = new Color();

  blankSkinMap: Uint8ClampedArray;

  constructor(decal: Decal, paints) {
    super(getAssetUrl(decal.base_texture), getAssetUrl(decal.rgba_map));

    this.primary = new Color(paints.primary);
    this.accent = new Color(paints.accent);
    this.paint = new Color(paints.decal);
    this.bodyPaint = new Color(paints.body);
  }

  getColor(i: number): Color {
    this.colorHolder.set(BLACK);

    if (this.blankSkinMap !== undefined) {
      if (this.blankSkinMap[i] > 150) {
        this.colorHolder.set(this.primary);
      } else if (this.blankSkinMap[i] >= 30 && this.blankSkinMap[i] <= 50) {
        return this.bodyPaint;
      } else {
        return this.colorHolder;
      }
    }

    if (this.rgbaMap === undefined) {
      return this.colorHolder;
    }

    if (this.rgbaMap[i] == 255 && this.rgbaMap[i + 2] == 0) {
      if (this.rgbaMap[i + 3] > 0) {
        overBlendColors(this.accent, this.primary, this.rgbaMap[i + 3], this.colorHolder);
      }

      if (this.rgbaMap[i + 1] > 0) {
        overBlendColors(this.paint, this.primary, this.rgbaMap[i + 3], this.colorHolder);
      }
    }

    return this.colorHolder;
  }

  clear() {
    this.base = undefined;
    this.rgbaMap = undefined;
  }
}
