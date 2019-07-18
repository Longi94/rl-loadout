import { TgaRgbaLoader } from "../utils/tga-rgba-loader";

// @ts-ignore
const useOffscreen = typeof OffscreenCanvas !== 'undefined';

export abstract class RgbaMapPipe {
  baseUrl: string;
  rgbaMapUrl: string;
  loader: TgaRgbaLoader = new TgaRgbaLoader();

  width: number;
  height: number;
  base: Uint8ClampedArray;
  rgbaMap: Uint8ClampedArray;
  data: Uint8ClampedArray;

  // @ts-ignore
  private canvas: OffscreenCanvas | HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private imageData: ImageData;

  protected constructor(baseUrl, rgbaMapUrl) {
    this.baseUrl = baseUrl;
    this.rgbaMapUrl = rgbaMapUrl;
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

    promises.push(new Promise((resolve, reject) => {
      this.loader.load(this.rgbaMapUrl, buffer => {
        this.width = buffer.width;
        this.height = buffer.height;
        this.rgbaMap = buffer.data;
        this.data = new Uint8ClampedArray(this.rgbaMap);

        // @ts-ignore
        this.canvas = useOffscreen ? new OffscreenCanvas(this.width, this.height) : document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context = this.canvas.getContext('2d');

        // create imageData object
        this.imageData = this.context.createImageData(this.width, this.height);
        resolve();
      }, undefined, reject);
    }));

    return Promise.all(promises);
  }

  /**
   * Update the data array that will eventually be turned into a texture
   */
  abstract update();

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
