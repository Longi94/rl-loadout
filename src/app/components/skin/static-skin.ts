import { Color } from "three";
import { overBlendColors } from "../utils/color";

export class StaticSkin {
  width: number;
  height: number;
  rgbaMap: Uint8ClampedArray;
  data: Uint8ClampedArray;

  primary: Color = new Color(0, 0, 1);
  accent: Color = new Color(1, 1, 1);

  constructor(width: number, height: number, rgbaMap: Uint8ClampedArray) {
    this.width = width;
    this.height = height;
    this.rgbaMap = rgbaMap;
    this.data = new Uint8ClampedArray(rgbaMap);
    this.update();
  }

  private update() {
    for (let i = 0; i < this.data.length; i += 4) {
      let color = new Color(0, 0, 0);
      if (this.rgbaMap[i] == 255) {
        color = this.primary;

        if (this.rgbaMap[i + 3] > 0) {
          color = overBlendColors(this.accent, this.primary, this.rgbaMap[i + 3]);
        }

        this.data[i] = color.r * 255;
        this.data[i + 1] = color.g * 255;
        this.data[i + 2] = color.b * 255;
        this.data[i + 3] = 255;
      }
    }
  }

  toTexture() {
    // @ts-ignore
    var useOffscreen = typeof OffscreenCanvas !== 'undefined';

    // @ts-ignore
    var canvas = useOffscreen ? new OffscreenCanvas(this.width, this.height) : document.createElement('canvas');
    let ctx = canvas.getContext('2d');

    canvas.width = this.width;
    canvas.height = this.height;

    // create imageData object
    let imageData = ctx.createImageData(this.width, this.height);

    // set our buffer as source
    imageData.data.set(this.data);

    ctx.putImageData(imageData, 0, 0);

    return useOffscreen ? canvas.transferToImageBitmap() : canvas;
  }
}
