import { TgaRgbaLoader } from "../utils/tga-rgba-loader";
import { Color, DataTexture, RGBAFormat } from "three";

const WIDTH = 2048;
const HEIGHT = 2048;

export abstract class RgbaMapPipeTexture {
  baseUrl: string;
  rgbaMapUrl: string;
  loader: TgaRgbaLoader = new TgaRgbaLoader();

  base: Uint8ClampedArray;
  rgbaMap: Uint8ClampedArray;
  data: Uint8Array;

  texture: DataTexture;

  protected constructor(baseUrl, rgbaMapUrl) {
    this.baseUrl = baseUrl;
    this.rgbaMapUrl = rgbaMapUrl;

    this.data = new Uint8Array(WIDTH * HEIGHT * 4);
    this.texture = new DataTexture(this.data, WIDTH, HEIGHT, RGBAFormat);
  }

  /**
   * Load the textures.
   */
  load(): Promise<any> {
    const promises = [];

    if (this.baseUrl !== undefined) {
      promises.push(new Promise((resolve, reject) => {
        this.loader.load(this.baseUrl, buffer => {
          this.base = buffer.data;
          resolve();
        }, undefined, reject);
      }));
    }

    if (this.rgbaMapUrl !== undefined) {
      promises.push(new Promise((resolve, reject) => {
        this.loader.load(this.rgbaMapUrl, buffer => {
          this.rgbaMap = buffer.data;
          resolve();
        }, undefined, reject);
      }));
    }

    return Promise.all(promises);
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
