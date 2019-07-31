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
  baseSkinMap: Uint8ClampedArray;

  constructor(decal: Decal, paints) {
    super(getAssetUrl(decal.base_texture), getAssetUrl(decal.rgba_map));

    this.primary = new Color(paints.primary);
    this.accent = new Color(paints.accent);

    if (paints.paint != undefined) {
      this.paint = new Color(paints.decal);
    }

    if (paints.body != undefined) {
      this.bodyPaint = new Color(paints.body);
    }
  }

  getColor(i: number): Color {
    if (this.baseSkinMap !== undefined) {
      this.colorHolder.setRGB(
        this.baseSkinMap[i] / 255,
        this.baseSkinMap[i + 1] / 255,
        this.baseSkinMap[i + 2] / 255
      )
    } else {
      this.colorHolder.set(BLACK);
    }

    if (this.blankSkinMap !== undefined) {
      if (this.blankSkinMap[i + 2] == 255) {
        return BLACK;
      }

      if (this.blankSkinMap[i] > 150) {
        this.colorHolder.set(this.primary);
      } else if (this.bodyPaint != undefined) {
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

      if (this.paint != undefined && this.rgbaMap[i + 1] > 0) {
        overBlendColors(this.paint, this.primary, this.rgbaMap[i + 3], this.colorHolder);
      }
    }

    return this.colorHolder;
  }

  clear() {
    this.base = undefined;
    this.rgbaMap = undefined;
  }

  dispose() {
    super.dispose();
    this.blankSkinMap = undefined;
    this.baseSkinMap = undefined;
  }
}
