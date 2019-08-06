import { TgaRgbaLoader } from "../utils/tga-rgba-loader";
import { Color, DataTexture, RepeatWrapping, RGBAFormat } from "three";
import { disposeIfExists } from "../utils/util";

export abstract class RgbaMapPipeTexture {
  baseUrl: string;
  rgbaMapUrl: string;
  loader: TgaRgbaLoader = new TgaRgbaLoader();

  base: Uint8ClampedArray;
  rgbaMap: Uint8ClampedArray;
  data: Uint8Array;

  width: number = 2048;
  height: number = 2048;
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
  load(): Promise<any> {
    const promises = [];

    if (this.baseUrl !== undefined) {
      promises.push(new Promise((resolve, reject) => {
        this.loader.load(this.baseUrl, buffer => {
          this.base = buffer.data;
          resolve(buffer);
        }, undefined, reject);
      }));
    }

    if (this.rgbaMapUrl !== undefined) {
      promises.push(new Promise((resolve, reject) => {
        this.loader.load(this.rgbaMapUrl, buffer => {
          this.rgbaMap = buffer.data;
          resolve(buffer);
        }, undefined, reject);
      }));
    }

    return new Promise((resolve, reject) => {
      Promise.all(promises).then(values => {
        if (values.length > 0) {
          this.width = values[0].width;
          this.height = values[0].height;
        }

        this.data = new Uint8Array(this.width * this.height * 4);
        this.texture = new DataTexture(this.data, this.width, this.height, RGBAFormat);
        this.texture.wrapS = RepeatWrapping;
        this.texture.wrapT = RepeatWrapping;
        resolve();
      }, reject);
    });
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
