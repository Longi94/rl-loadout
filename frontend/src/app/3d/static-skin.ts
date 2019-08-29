import { Color, Texture } from 'three';
import { BLACK, overBlendColors } from '../utils/color';
import { RgbaMapPipeTexture } from './rgba-map-pipe-texture';
import { Decal } from '../model/decal';
import { getAssetUrl } from '../utils/network';
import { BodyTexture } from './body/body-texture';


export class StaticSkin extends RgbaMapPipeTexture implements BodyTexture {

  primary: Color;
  accent: Color;
  paint: Color;
  bodyPaint: Color;
  private colorHolder = new Color();

  blankSkinMap: Uint8ClampedArray;
  baseSkinMap: Uint8ClampedArray;

  constructor(decal: Decal) {
    super(getAssetUrl(decal.base_texture), getAssetUrl(decal.rgba_map));
  }

  getColor(i: number): Color {
    if (this.baseSkinMap !== undefined) {
      this.colorHolder.setRGB(
        this.baseSkinMap[i] / 255,
        this.baseSkinMap[i + 1] / 255,
        this.baseSkinMap[i + 2] / 255
      );
      overBlendColors(this.colorHolder, BLACK, this.baseSkinMap[i + 3], this.colorHolder);
    } else {
      this.colorHolder.set(BLACK);
    }

    if (this.blankSkinMap !== undefined) {
      if (this.blankSkinMap[i + 2] === 255) {
        return this.colorHolder;
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

    if (this.rgbaMap[i] === 255 && this.rgbaMap[i + 2] === 0) {
      if (this.rgbaMap[i + 3] > 0) {
        overBlendColors(this.accent, this.primary, this.rgbaMap[i + 3], this.colorHolder);
      }

      if (this.paint != undefined && this.rgbaMap[i + 1] > 0) {
        overBlendColors(this.paint, this.primary, this.rgbaMap[i + 3], this.colorHolder);
      }
    }

    return this.colorHolder;
  }

  dispose() {
    super.dispose();
    this.blankSkinMap = undefined;
    this.baseSkinMap = undefined;
  }

  getTexture(): Texture {
    return this.texture;
  }
}
