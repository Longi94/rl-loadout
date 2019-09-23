import { PromiseLoader } from '../utils/loader';
import { TgaRgbaLoader } from '../utils/tga-rgba-loader';
import { Color } from 'three';
import { Layer, LayeredTexture } from './layered-texture';
import { PaintConfig } from '../service/loadout.service';
import { getChannel, getMaskPixels, ImageChannel, opaque } from '../utils/image';

export class ChassisSkin {

  private tgaLoader = new PromiseLoader(new TgaRgbaLoader());
  private paint: Color;
  private paintLayer: Layer;
  private paintPixels: Set<number>;
  texture: LayeredTexture;

  private accent: Color;
  private accentLayer: Layer;
  private accentPixels: Set<number>;

  constructor(private baseUrl: string, private rgbaMapUrl: string, paints: PaintConfig) {
    this.paint = paints.body;
    this.accent = paints.accent;
  }

  dispose() {
    this.texture.dispose();
  }

  async load() {
    const baseTask = this.tgaLoader.load(this.baseUrl);
    const rgbaMapTask = this.tgaLoader.load(this.rgbaMapUrl);

    const baseResult = await baseTask;
    const rgbaMapResult = await rgbaMapTask;

    this.texture = new LayeredTexture(opaque(baseResult.data), baseResult.width, baseResult.height);

    if (rgbaMapResult != undefined) {
      const alphaChannel = getChannel(rgbaMapResult.data, ImageChannel.R);

      this.paintPixels = new Set<number>();
      for (let i = 0; i < alphaChannel.length; i++) {
        if (alphaChannel[i] > 0) {
          this.paintPixels.add(i * 4);
        }
      }

      this.paintLayer = new Layer(alphaChannel, this.paint);
      this.texture.addLayer(this.paintLayer);
    }

    const accentMask = getChannel(baseResult.data, ImageChannel.A);

    if (accentMask.some(value => value === 0)) {
      this.accentLayer = new Layer(accentMask, this.accent);
      this.accentPixels = getMaskPixels(accentMask);
      this.texture.addLayer(this.accentLayer);
    }

    this.texture.update();
  }

  setPaint(paint: Color) {
    this.paint = paint;
    if (this.paintLayer != undefined) {
      this.paintLayer.data = paint;
      this.texture.update(this.paintPixels);
    }
  }

  setAccent(accent: Color) {
    this.accent = accent;
    if (this.accentLayer != undefined) {
      this.accentLayer.data = accent;
      this.texture.update(this.accentPixels);
    }
  }
}
