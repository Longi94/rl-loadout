import { BodyModel } from './body-model';
import { Decal } from '../../model/decal';
import { BodyTexture } from './body-texture';
import { Color, Texture } from 'three';
import { RgbaMapPipeTexture } from '../rgba-map-pipe-texture';
import { BLACK, overBlendColors } from '../../utils/color';

class FelineBodySkin extends RgbaMapPipeTexture implements BodyTexture {

  accent: Color;
  baseSkinMap: Uint8ClampedArray;
  blankSkinMap: Uint8ClampedArray;
  bodyPaint: Color;
  paint: Color;
  primary: Color;
  private colorHolder = new Color();
  private backLightsColor = new Color('#7f0000');

  constructor(baseUrl: string, rgbaMapUrl: string) {
    super(baseUrl, rgbaMapUrl);
  }

  getColor(i: number): Color {

    if (this.rgbaMap[i + 2] === 255) {
      return BLACK;
    }

    this.colorHolder.setRGB(
      this.base[i] / 255,
      this.base[i + 1] / 255,
      this.base[i + 2] / 255,
    );

    if (this.rgbaMap[i] < 42) {
      return this.colorHolder;
    }

    overBlendColors(BLACK, this.colorHolder, this.rgbaMap[i], this.colorHolder);

    if (this.rgbaMap[i + 3] < 255) {
      overBlendColors(this.primary, this.colorHolder, 255 - this.rgbaMap[i + 3], this.colorHolder);
    }

    if (this.rgbaMap[i + 1] > 0) {
      overBlendColors(this.backLightsColor, this.colorHolder, this.rgbaMap[i + 1], this.colorHolder);
    }

    return this.colorHolder;
  }

  getTexture(): Texture {
    return this.texture;
  }
}

export class FelineModel extends BodyModel {
  initBodySkin(decal: Decal): BodyTexture {
    return new FelineBodySkin(this.baseSkinMapUrl, this.blankSkinMapUrl);
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
