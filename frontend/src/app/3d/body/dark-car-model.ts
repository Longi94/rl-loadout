import { BodyModel } from './body-model';
import { Color, Texture } from 'three';
import { Decal } from '../../model/decal';
import { BodyTexture } from './body-texture';
import { Layer, LayeredTexture } from '../layered-texture';
import { PromiseLoader } from '../../utils/loader';
import { TgaRgbaLoader } from '../../utils/tga-rgba-loader';
import { PaintConfig } from '../../service/loadout.service';
import { Body } from '../../model/body';
import { getAssetUrl } from '../../utils/network';
import { getChannel, getMaskPixels, ImageChannel, invertChannel } from '../../utils/image';
import { BLACK } from '../../utils/color';

class DarkCarBodySkin implements BodyTexture {

  private readonly loader = new PromiseLoader(new TgaRgbaLoader());

  private readonly baseUrl;
  private readonly blankSkinUrl;

  private primary: Color;

  private texture: LayeredTexture;

  private primaryLayer: Layer;
  private primaryPixels: number[];

  constructor(body: Body, paints: PaintConfig) {
    this.baseUrl = getAssetUrl(body.base_skin);
    this.blankSkinUrl = getAssetUrl(body.blank_skin);
    this.primary = paints.primary;
  }

  async load() {
    const baseTask = this.loader.load(this.baseUrl);
    const rgbaMapTask = this.loader.load(this.blankSkinUrl);

    const baseResult = await baseTask;

    const baseSkinMap = baseResult.data;
    const blankSkinMap = (await rgbaMapTask).data;

    this.texture = new LayeredTexture(baseSkinMap, baseResult.width, baseResult.height);

    const shadowMask = getChannel(blankSkinMap, ImageChannel.G);
    invertChannel(shadowMask);

    const primaryMask = getChannel(blankSkinMap, ImageChannel.A);
    invertChannel(primaryMask);

    this.primaryLayer = new Layer(primaryMask, this.primary);
    this.primaryPixels = getMaskPixels(primaryMask);

    this.texture.addLayer(new Layer(shadowMask, BLACK));
    this.texture.addLayer(this.primaryLayer);
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

export class DarkCarModel extends BodyModel {

  initBodySkin(body: Body, decal: Decal, paints: PaintConfig): BodyTexture {
    return new DarkCarBodySkin(body, paints);
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
