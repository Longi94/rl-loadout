import { Color, Texture } from 'three';
import { Decal } from '../model/decal';
import { getAssetUrl } from '../utils/network';
import { BodyTexture } from './body/body-texture';
import { PromiseLoader } from '../utils/loader';
import { TgaRgbaLoader } from '../utils/tga-rgba-loader';
import { Layer, LayeredTexture } from './layered-texture';
import { Body } from '../model/body';
import { applyMaskToChannel, getChannel, getMaskPixels, ImageChannel, invertChannel, opaque } from '../utils/image';
import { PaintConfig } from '../service/loadout.service';
import { mergeSets } from '../utils/util';


export class StaticSkin implements BodyTexture {

  private readonly loader: PromiseLoader = new PromiseLoader(new TgaRgbaLoader());

  private readonly baseUrl: string;
  private readonly rgbaMapUrl: string;
  private readonly bodyBaseSkinUrl: string;
  private readonly bodyBlankSkinUrl: string;

  private texture: LayeredTexture;

  private base: Uint8ClampedArray;
  private decalRgbaMap: Uint8ClampedArray;
  private bodyBlankSkin: Uint8ClampedArray;

  private primary: Color;
  private accent: Color;
  private paint: Color;
  private bodyPaint: Color;

  private bodyPaintLayer: Layer;
  private primaryLayer: Layer;
  private decalLayer: Layer;
  private decalPaintLayer: Layer;
  private bodyAccentLayer: Layer;

  private primaryPixels: Set<number>;
  private bodyPaintPixels: Set<number>;
  private accentPixels: Set<number>;
  private decalPaintPixels: Set<number>;

  constructor(body: Body, decal: Decal, paints: PaintConfig) {
    this.baseUrl = getAssetUrl(decal.base_texture);
    this.rgbaMapUrl = getAssetUrl(decal.rgba_map);
    this.bodyBaseSkinUrl = getAssetUrl(body.base_skin);
    this.bodyBlankSkinUrl = getAssetUrl(body.blank_skin);

    this.primary = paints.primary;
    this.accent = paints.accent;
    this.paint = paints.decal;
    this.bodyPaint = paints.body;
  }

  async load() {
    const baseTask = this.loader.load(this.baseUrl != undefined ? this.baseUrl : this.bodyBaseSkinUrl);
    const rgbaMapTask = this.loader.load(this.rgbaMapUrl);
    const bodyBlankSkinTask = this.loader.load(this.bodyBlankSkinUrl);

    const baseResult = await baseTask;

    const width = baseResult.width;
    const height = baseResult.height;

    this.base = baseResult.data;

    const rgbaMapResult = await rgbaMapTask;
    if (rgbaMapResult != undefined) {
      this.decalRgbaMap = rgbaMapResult.data;
    }

    this.bodyBlankSkin = (await bodyBlankSkinTask).data;

    this.texture = new LayeredTexture(opaque(this.base), width, height);

    const bodyPaintMask = getChannel(this.bodyBlankSkin, ImageChannel.R);
    invertChannel(bodyPaintMask);
    this.bodyPaintLayer = new Layer(bodyPaintMask, this.bodyPaint);
    this.bodyPaintPixels = getMaskPixels(bodyPaintMask);

    const primaryMask = getChannel(this.decalRgbaMap != undefined ? this.decalRgbaMap : this.bodyBlankSkin, ImageChannel.R);
    this.primaryPixels = new Set<number>();
    for (let i = 0; i < primaryMask.length; i++) {
      if (primaryMask[i] < 150) {
        primaryMask[i] = 0;
      } else {
        this.primaryPixels.add(i * 4);
      }
    }
    this.primaryLayer = new Layer(primaryMask, this.primary);

    const decalMask = getChannel(this.decalRgbaMap, ImageChannel.A);
    applyMaskToChannel(decalMask, primaryMask);
    this.decalLayer = new Layer(decalMask, this.accent);
    this.accentPixels = getMaskPixels(decalMask);

    const decalPaintMask = getChannel(this.decalRgbaMap, ImageChannel.G);
    this.decalPaintLayer = new Layer(decalPaintMask, this.paint);
    this.decalPaintPixels = getMaskPixels(decalPaintMask);

    const bodyAccentMask = getChannel(this.bodyBlankSkin, ImageChannel.G);
    this.bodyAccentLayer = new Layer(bodyAccentMask, this.accent);

    this.texture.addLayer(this.bodyPaintLayer);
    this.texture.addLayer(this.primaryLayer);
    this.texture.addLayer(this.decalLayer);
    this.texture.addLayer(this.decalPaintLayer);

    if (bodyAccentMask.some(value => value > 0)) {
      this.texture.addLayer(this.bodyAccentLayer);
      this.accentPixels = mergeSets<number>(this.accentPixels, getMaskPixels(bodyAccentMask));
    }

    this.texture.update();
  }

  setBodyPaint(color: Color) {
    this.bodyPaint = color;
    this.bodyPaintLayer.data = color;
    this.texture.update(this.bodyPaintPixels);
  }

  setPrimary(color: Color) {
    this.primary = color;
    this.primaryLayer.data = color;
    this.texture.update(this.primaryPixels);
  }

  setAccent(color: Color) {
    this.accent = color;
    this.decalLayer.data = color;
    if (this.bodyAccentLayer != undefined) {
      this.bodyAccentLayer.data = color;
    }
    this.texture.update(this.accentPixels);
  }

  setPaint(color: Color) {
    this.paint = color;
    this.decalPaintLayer.data = color;
    this.texture.update(this.decalPaintPixels);
  }

  dispose() {
    this.texture.dispose();
    this.base = undefined;
    this.decalRgbaMap = undefined;
    this.bodyBlankSkin = undefined;
  }

  getTexture(): Texture {
    return this.texture.texture;
  }
}
