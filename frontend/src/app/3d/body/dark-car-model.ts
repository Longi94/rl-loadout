import { BodyModel } from './body-model';
import { RgbaMapPipeTexture } from '../rgba-map-pipe-texture';
import { Color, Texture } from 'three';
import { Decal } from '../../model/decal';
import { BodyTexture } from './body-texture';
import { BLACK, overBlendColors } from '../../utils/color';

class DarkCarBodySkin extends RgbaMapPipeTexture implements BodyTexture {

  accent: Color;
  baseSkinMap: Uint8ClampedArray;
  blankSkinMap: Uint8ClampedArray;
  bodyPaint: Color;
  paint: Color;
  primary: Color;
  private colorHolder = new Color();
  private colorHolder2 = new Color();

  constructor(baseUrl: string, rgbaMapUrl: string) {
    super(baseUrl, rgbaMapUrl);
  }

  getColor(i: number): Color {
    if (this.rgbaMap[i + 2] === 255) {
      return BLACK;
    }

    this.colorHolder.set(this.primary);

    if (this.rgbaMap[i + 3] > 0) {
      this.colorHolder2.setRGB(
        this.base[i] / 255,
        this.base[i + 1] / 255,
        this.base[i + 2] / 255
      );

      overBlendColors(this.colorHolder2, this.colorHolder, this.rgbaMap[i + 3], this.colorHolder);

      if (this.rgbaMap[i + 1] < 255) {
        overBlendColors(BLACK, this.colorHolder, 255 - this.rgbaMap[i + 1], this.colorHolder);
      }
    }

    return this.colorHolder;
  }

  getTexture(): Texture {
    return this.texture;
  }
}

export class DarkCarModel extends BodyModel {

  initBodySkin(decal: Decal): BodyTexture {
    return new DarkCarBodySkin(this.baseSkinMapUrl, this.blankSkinMapUrl);
  }

  setPaintColor(color: Color) {
  }

  changeDecal(decal: Decal, paints: { [p: string]: string }): Promise<any> {
    return Promise.resolve();
  }

  setPrimaryColor(color: Color) {
    this.bodySkin.primary = color;
    this.bodySkin.update();
  }

  setAccentColor(color: Color) {
  }

  setDecalPaintColor(color: Color) {
  }
}
