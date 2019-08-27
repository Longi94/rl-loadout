import { BodyModel } from './body-model';
import { RgbaMapPipeTexture } from '../rgba-map-pipe-texture';
import { Color, Texture } from 'three';
import { Decal } from '../../model/decal';
import { BodyTexture } from './body-texture';
import { BLACK, overBlendColors } from '../../utils/color';

class EggplantBodySkin extends RgbaMapPipeTexture implements BodyTexture {

  accent: Color;
  baseSkinMap: Uint8ClampedArray;
  blankSkinMap: Uint8ClampedArray;
  bodyPaint: Color;
  paint: Color;
  primary: Color;
  private bodyColor = new Color('#111111');
  private colorHolder = new Color();

  constructor(baseUrl: string, rgbaMapUrl: string) {
    super(baseUrl, rgbaMapUrl);
  }

  getColor(i: number): Color {

    if (this.rgbaMap[i + 2] === 255) {
      return BLACK;
    } else if (this.rgbaMap[i + 3] === 255) {
      return this.bodyColor;
    }

    this.colorHolder.set(this.bodyColor);

    overBlendColors(this.primary, this.colorHolder, 255 - this.rgbaMap[i + 3], this.colorHolder);

    return this.colorHolder;
  }

  getTexture(): Texture {
    return this.texture;
  }
}

export class EggplantModel extends BodyModel {

  initBodySkin(decal: Decal): BodyTexture {
    return new EggplantBodySkin(this.baseSkinMapUrl, this.blankSkinMapUrl);
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
