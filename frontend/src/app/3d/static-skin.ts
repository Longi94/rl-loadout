import { Color, Texture } from 'three';
import { Decal } from '../model/decal';
import { getAssetUrl } from '../utils/network';
import { BodyTexture } from './body/body-texture';
import { PromiseLoader } from '../utils/loader';
import { TgaRgbaLoader } from '../utils/tga-rgba-loader';
import { Layer, LayeredTexture } from './layered-texture';
import { Body } from '../model/body';
import { getChannel, getMaskPixels, ImageChannel } from '../utils/image';
import { PaintConfig } from '../service/loadout.service';


export class StaticSkin implements BodyTexture {

  private readonly loader: PromiseLoader = new PromiseLoader(new TgaRgbaLoader());

  private readonly baseUrl: string;
  private readonly rgbaMapUrl: string;
  private readonly bodyBaseSkinUrl: string;
  private readonly bodyBlankSkinUrl: string;

  private texture: LayeredTexture;

  private decalBase: Uint8ClampedArray;
  private decalRgbaMap: Uint8ClampedArray;
  private bodyBaseSkin: Uint8ClampedArray;
  private bodyBlankSkin: Uint8ClampedArray;

  private primary: Color;
  private accent: Color;
  private paint: Color;
  private bodyPaint: Color;

  private bodyPaintLayer: Layer;
  private primaryLayer: Layer;
  private decalLayer: Layer;
  private decalPaintLayer: Layer;

  private primaryPixels: number[];
  private bodyPaintPixels: number[];
  private decalPixels: number[];
  private decalPaintPixels: number[];

  constructor(body: Body, decal: Decal, paints: PaintConfig) {
    this.baseUrl = getAssetUrl(decal.base_texture);
    this.rgbaMapUrl = getAssetUrl(decal.rgba_map);
    this.bodyBaseSkinUrl = getAssetUrl(body.base_skin);
    this.bodyBlankSkinUrl = getAssetUrl(body.blank_skin);

    this.primary = new Color(paints.primary);
    this.accent = new Color(paints.accent);

    if (paints.decal) {
      this.paint = new Color(paints.decal);
    }

    if (paints.body) {
      this.bodyPaint = new Color(paints.body);
    }
  }

  async load() {
    const baseTask = this.loader.load(this.baseUrl);
    const rgbaMapTask = this.loader.load(this.rgbaMapUrl);
    const bodyBaseSkinTask = this.loader.load(this.bodyBaseSkinUrl);
    const bodyBlankSkinTask = this.loader.load(this.bodyBlankSkinUrl);

    const bodyBaseSkinResult = await bodyBaseSkinTask;

    const width = bodyBaseSkinResult.width;
    const height = bodyBaseSkinResult.height;

    const baseResult = await baseTask;
    if (baseResult != undefined) {
      this.decalBase = baseResult.data;
    }
    const rgbaMapResult = await rgbaMapTask;
    if (rgbaMapResult != undefined) {
      this.decalRgbaMap = rgbaMapResult.data;
    }

    this.bodyBaseSkin = bodyBaseSkinResult.data;
    this.bodyBlankSkin = (await bodyBlankSkinTask).data;

    this.texture = new LayeredTexture(this.bodyBaseSkin, width, height);

    this.bodyPaintLayer = new Layer(true, this.bodyPaint);

    const primaryMask = getChannel(this.bodyBlankSkin, ImageChannel.R);
    this.bodyPaintPixels = [];
    this.primaryPixels = [];
    for (let i = 0; i < primaryMask.length; i++) {
      if (primaryMask[i] < 150) {
        primaryMask[i] = 0;
      } else {
        this.primaryPixels.push(i * 4);
      }

      if (primaryMask[i] < 255) {
        this.bodyPaintPixels.push(i * 4);
      }
    }
    this.primaryLayer = new Layer(primaryMask, this.primary);

    const decalMask = getChannel(this.decalRgbaMap, ImageChannel.A);
    this.decalLayer = new Layer(decalMask, this.accent);
    this.decalPixels = getMaskPixels(decalMask);

    const decalPaintMask = getChannel(this.decalRgbaMap, ImageChannel.G);
    this.decalPaintLayer = new Layer(decalPaintMask, this.paint);
    this.decalPaintPixels = getMaskPixels(decalPaintMask);

    this.texture.addLayer(this.bodyPaintLayer);
    this.texture.addLayer(this.primaryLayer);
    this.texture.addLayer(this.decalLayer);
    this.texture.addLayer(this.decalPaintLayer);

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
    this.texture.update(this.decalPixels);
  }

  setPaint(color: Color) {
    this.paint = color;
    this.decalPaintLayer.data = color;
    this.texture.update(this.decalPaintPixels);
  }

  dispose() {
    this.texture.dispose();
    this.decalBase = undefined;
    this.decalRgbaMap = undefined;
    this.bodyBaseSkin = undefined;
    this.bodyBlankSkin = undefined;
  }

  getTexture(): Texture {
    return this.texture.texture;
  }
}
