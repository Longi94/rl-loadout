import { TgaRgbaLoader } from '../utils/tga-rgba-loader';
import { Color, DataTexture, RepeatWrapping, RGBAFormat } from 'three';
import { disposeIfExists } from '../utils/util';
import { PromiseLoader } from '../utils/loader';

export abstract class RgbaMapPipeTexture {
  baseUrl: string;
  rgbaMapUrl: string;
  loader: PromiseLoader = new PromiseLoader(new TgaRgbaLoader());

  base: Uint8ClampedArray;
  rgbaMap: Uint8ClampedArray;
  data: Uint8Array;

  width = 2048;
  height = 2048;
  texture: DataTexture;

  protected constructor(baseUrl, rgbaMapUrl) {
    this.baseUrl = baseUrl;
    this.rgbaMapUrl = rgbaMapUrl;
  }

  dispose() {
    this.base = undefined;
    this.rgbaMap = undefined;
    this.data = undefined;
    disposeIfExists(this.texture);
  }

  /**
   * Load the textures.
   */
  async load() {
    let baseTask = this.loader.load(this.baseUrl);
    let rgbaMapTask = this.loader.load(this.rgbaMapUrl);

    const baseResult = await baseTask;
    const rgbaMapResult = await rgbaMapTask;

    if (baseResult != undefined) {
      this.base = baseResult.data;
      this.width = baseResult.width;
      this.height = baseResult.height;
    }

    if (rgbaMapResult != undefined) {
      this.rgbaMap = rgbaMapResult.data;
    }

    this.data = new Uint8Array(this.width * this.height * 4);
    this.texture = new DataTexture(this.data, this.width, this.height, RGBAFormat);
    this.texture.wrapS = RepeatWrapping;
    this.texture.wrapT = RepeatWrapping;
  }

  /**
   * Update the data array that will eventually be turned into a texture
   */
  update() {
    for (let i = 0; i < this.data.length; i += 4) {
      const color = this.getColor(i);

      this.data[i] = color.r * 255;
      this.data[i + 1] = color.g * 255;
      this.data[i + 2] = color.b * 255;
      this.data[i + 3] = 255;
    }

    this.texture.needsUpdate = true;
  }

  /**
   * Calculate the color for the given pixel
   * @param i index of the pixel (i:r, i+1:g, i+2:b, i+3:a)
   */
  abstract getColor(i: number): Color;
}
