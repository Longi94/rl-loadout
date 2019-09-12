import { BodyModel } from './body-model';
import { Decal } from '../../model/decal';
import { BodyTexture } from './body-texture';
import { Color, Texture } from 'three';
import { BLACK } from '../../utils/color';
import { Body } from '../../model/body';
import { PaintConfig } from '../../service/loadout.service';
import { PromiseLoader } from '../../utils/loader';
import { TgaRgbaLoader } from '../../utils/tga-rgba-loader';
import { Layer, LayeredTexture } from '../layered-texture';
import { getAssetUrl } from '../../utils/network';
import { getChannel, getMaskPixels, ImageChannel, invertChannel } from '../../utils/image';

class FelineBodySkin implements BodyTexture {

  private readonly loader = new PromiseLoader(new TgaRgbaLoader());

  private readonly baseUrl;
  private readonly blankSkinUrl;

  private baseSkinMap: Uint8ClampedArray;
  private blankSkinMap: Uint8ClampedArray;
  private primary: Color;

  private texture: LayeredTexture;

  private primaryLayer: Layer;
  private primaryPixels: number[];

  constructor(body: Body, paints: PaintConfig) {
    this.baseUrl = getAssetUrl(body.base_skin);
    this.blankSkinUrl = getAssetUrl(body.blank_skin);
    this.primary = new Color(paints.primary);
  }

  async load() {
    const baseTask = this.loader.load(this.baseUrl);
    const rgbaMapTask = this.loader.load(this.blankSkinUrl);

    const baseResult = await baseTask;

    this.baseSkinMap = baseResult.data;
    this.blankSkinMap = (await rgbaMapTask).data;

    this.texture = new LayeredTexture(this.baseSkinMap, baseResult.width, baseResult.height);

    const bodyMask = getChannel(this.blankSkinMap, ImageChannel.R);
    for (let i = 0; i < bodyMask.length; i++) {
      if (bodyMask[i] < 42) {
        bodyMask[i] = 0;
      }
    }

    const primaryMask = getChannel(this.blankSkinMap, ImageChannel.A);
    invertChannel(primaryMask);
    this.primaryLayer = new Layer(primaryMask, this.primary);
    this.primaryPixels = getMaskPixels(primaryMask);

    const backLightMask = getChannel(this.blankSkinMap, ImageChannel.G);

    this.texture.addLayer(new Layer(bodyMask, BLACK));
    this.texture.addLayer(this.primaryLayer);
    this.texture.addLayer(new Layer(backLightMask, new Color('#7f0000')));
    this.texture.update();
  }

  dispose() {
    this.texture.dispose();
  }

  setAccent(color: Color) {
  }

  setBodyPaint(color: Color) {
  }

  setPaint(color: Color) {
  }

  setPrimary(color: Color) {
    this.primary = color;
    this.primaryLayer.data = color;
    this.texture.update(this.primaryPixels);
  }

  getTexture(): Texture {
    return this.texture.texture;
  }
}

export class FelineModel extends BodyModel {
  initBodySkin(body: Body, decal: Decal, paints: PaintConfig): BodyTexture {
    return new FelineBodySkin(body, paints);
  }

  setPaintColor(color: Color) {
  }

  async changeDecal(decal: Decal, paints: PaintConfig) {
  }

  setPrimaryColor(color: Color) {
    this.bodySkin.setPrimary(color);
  }

  setAccentColor(color: Color) {
  }

  setDecalPaintColor(color: Color) {
  }
}
