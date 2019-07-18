import { Color } from "three";
import { overBlendColors } from "../utils/color";

// @ts-ignore
const useOffscreen = typeof OffscreenCanvas !== 'undefined';

export class StaticSkin {
  width: number;
  height: number;
  rgbaMap: Uint8ClampedArray;
  data: Uint8ClampedArray;

  primary: Color = new Color(0, 0, 1);
  accent: Color = new Color(1, 1, 1);
  paint: Color = new Color(1, 0, 0);

  // @ts-ignore
  private readonly canvas: OffscreenCanvas | HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private readonly imageData: ImageData;

  constructor(tgaRgbaMap, paints) {
    this.width = tgaRgbaMap.width;
    this.height = tgaRgbaMap.height;
    this.rgbaMap = tgaRgbaMap.data;
    this.data = new Uint8ClampedArray(tgaRgbaMap.data);

    this.primary = new Color(paints.primary);
    this.accent = new Color(paints.accent);
    this.paint = new Color(paints.decal);

    this.update();

    // @ts-ignore
    this.canvas = useOffscreen ? new OffscreenCanvas(this.width, this.height) : document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.context = this.canvas.getContext('2d');

    // create imageData object
    this.imageData = this.context.createImageData(this.width, this.height);
  }

  update() {
    for (let i = 0; i < this.data.length; i += 4) {
      let color = new Color(0, 0, 0);

      if (this.rgbaMap[i] == 255 && this.rgbaMap[i + 2] == 0) {
        color = this.primary;

        if (this.rgbaMap[i + 3] > 0) {
          color = overBlendColors(this.accent, this.primary, this.rgbaMap[i + 3]);
        }

        if (this.rgbaMap[i + 1] > 0) {
          color = overBlendColors(this.paint, this.primary, this.rgbaMap[i + 3]);
        }
      }

      this.data[i] = color.r * 255;
      this.data[i + 1] = color.g * 255;
      this.data[i + 2] = color.b * 255;
      this.data[i + 3] = 255;
    }
  }

  toTexture() {
    // set our buffer as source
    this.imageData.data.set(this.data);

    this.context.putImageData(this.imageData, 0, 0);

    return useOffscreen ? this.canvas.transferToImageBitmap() : this.canvas;
  }
}
