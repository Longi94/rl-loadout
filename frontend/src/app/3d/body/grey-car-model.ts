import { BodyModel } from './body-model';
import { Color, Texture } from 'three';
import { Decal } from '../../model/decal';
import { BodyTexture } from './body-texture';
import { Body } from '../../model/body';
import { PaintConfig } from '../../service/loadout.service';
import { PromiseLoader } from '../../utils/loader';
import { TgaRgbaLoader } from '../../utils/tga-rgba-loader';
import { Layer, LayeredTexture } from '../layered-texture';
import { getAssetUrl } from '../../utils/network';
import { getChannel, ImageChannel } from '../../utils/image';


class GreyCarSkin implements BodyTexture {

  private readonly loader = new PromiseLoader(new TgaRgbaLoader());

  private readonly baseUrl;
  private readonly blankSkinUrl;

  private primary: Color;

  private texture: LayeredTexture;

  private primaryLayer: Layer;
  private primaryPixels: Set<number>;

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

    const primaryMask = getChannel(blankSkinMap, ImageChannel.R);
    const bodyMask = getChannel(blankSkinMap, ImageChannel.A);

    this.primaryPixels = new Set<number>();

    for (let i = 0; i < primaryMask.length; i++) {
      if (primaryMask[i] < 42) {
        primaryMask[i] = 0;
      } else if (bodyMask[i] < 255) {
        this.primaryPixels.add(i * 4);
      }
    }

    this.primaryLayer = new Layer(primaryMask, this.primary);

    this.texture.addLayer(this.primaryLayer);
    this.texture.addLayer(new Layer(bodyMask, new Color(0.329729, 0.329729, 0.329729)));
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


export class GreyCarModel extends BodyModel {

  initBodySkin(body: Body, decal: Decal, paints: PaintConfig): BodyTexture {
    return new GreyCarSkin(body, paints);
  }

  setPaintColor(color: Color) {
  }

  async changeDecal(decal: Decal, paints: PaintConfig) {
  }

  setPrimaryColor(color: Color) {
    this.bodySkin.setPrimary(color);
    this.chassisSkin.setPaint(color);
  }

  setAccentColor(color: Color) {
  }

  setDecalPaintColor(color: Color) {
  }
}
