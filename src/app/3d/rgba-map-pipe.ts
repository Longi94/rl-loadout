import { TgaRgbaLoader } from "../utils/tga-rgba-loader";
import { Color } from "three";

// @ts-ignore
const useOffscreen = typeof OffscreenCanvas !== 'undefined';

const WIDTH = 2048;
const HEIGHT = 2048;

export abstract class RgbaMapPipe {
  baseUrl: string;
  rgbaMapUrl: string;
  loader: TgaRgbaLoader = new TgaRgbaLoader();

  base: Uint8ClampedArray;
  rgbaMap: Uint8ClampedArray;
  data: Uint8ClampedArray;

  // @ts-ignore
  private readonly canvas: OffscreenCanvas | HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;
  private readonly imageData: ImageData;

  protected constructor(baseUrl, rgbaMapUrl) {
    this.baseUrl = baseUrl;
    this.rgbaMapUrl = rgbaMapUrl;

    // @ts-ignore
    this.canvas = useOffscreen ? new OffscreenCanvas(WIDTH, HEIGHT) : document.createElement('canvas');
    this.canvas.width = WIDTH;
    this.canvas.height = HEIGHT;
    this.context = this.canvas.getContext('2d');

    // create imageData object
    this.imageData = this.context.createImageData(WIDTH, HEIGHT);

    this.data = new Uint8ClampedArray(WIDTH * HEIGHT * 4);
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
  }

  /**
   * Calculate the color for the given pixel
   * @param i index of the pixel (i:r, i+1:g, i+2:b, i+3:a)
   */
  abstract getColor(i: number): Color;

  /**
   * Convert the data array into a canvas that has the texture.
   */
  toTexture() {
    // set our buffer as source
    this.imageData.data.set(this.data);

    this.context.putImageData(this.imageData, 0, 0);

    return useOffscreen ? this.canvas.transferToImageBitmap() : this.canvas;
  }
}
