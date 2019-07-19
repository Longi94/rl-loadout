import { Color } from "three";
import { overBlendColors } from "../utils/color";
import { RgbaMapPipe } from "./rgba-map-pipe";
import { Decal } from "../model/decal";
import { environment } from "../../environments/environment";

const ASSET_HOST = environment.assetHost;

export class StaticSkin extends RgbaMapPipe {

  primary: Color = new Color(0, 0, 1);
  accent: Color = new Color(1, 1, 1);
  paint: Color = new Color(1, 0, 0);

  blankSkinMap: Uint8ClampedArray;

  constructor(decal: Decal, paints) {
    super(undefined, undefined);
    this.baseUrl = decal.base_texture === undefined ? undefined : `${ASSET_HOST}/${decal.base_texture}`;
    this.rgbaMapUrl = decal.rgba_map === undefined ? undefined : `${ASSET_HOST}/${decal.rgba_map}`;

    this.primary = new Color(paints.primary);
    this.accent = new Color(paints.accent);
    this.paint = new Color(paints.decal);
  }

  getColor(i: number): Color {
    let color = new Color(0, 0, 0);

    if (this.blankSkinMap !== undefined) {
      if (this.blankSkinMap[i] !== 255) {
        return color;
      } else {
        color = this.primary;
      }
    }

    if (this.rgbaMap === undefined) {
      return color;
    }

    if (this.rgbaMap[i] == 255 && this.rgbaMap[i + 2] == 0) {
      color = this.primary;

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
