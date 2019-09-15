import { Color, DataTexture, RepeatWrapping } from 'three';
import { overBlendColors } from '../utils/color';

export class LayeredTexture {
  readonly texture: DataTexture;
  private readonly data: Uint8ClampedArray;
  private readonly layers: Layer[] = [];
  private readonly colorHolder = new Color();
  private readonly colorHolder2 = new Color();

  constructor(private base?: Uint8ClampedArray, width?: number, height?: number) {
    this.data = new Uint8ClampedArray(this.base);
    this.texture = new DataTexture(this.data, width, height);
    this.texture.wrapS = RepeatWrapping;
    this.texture.wrapT = RepeatWrapping;
    this.texture.needsUpdate = true;
  }

  dispose() {
    this.texture.dispose();
  }

  addLayer(layer: Layer) {
    this.layers.push(layer);
  }

  /**
   * Update the texture.
   * @pixel mask the pixel indexes to update (divisible by 4)
   */
  update(pixel?: number[]) {
    if (this.layers.length === 0) {
      return;
    }

    if (pixel != undefined) {
      for (const i of pixel) {
        this.updatePixel(i);
      }
    } else {
      for (let i = 0; i < this.data.length; i += 4) {
        this.updatePixel(i);
      }
    }

    this.texture.needsUpdate = true;
  }

  private updatePixel(i: number) {
    this.colorHolder.setRGB(
      this.base[i] / 255,
      this.base[i + 1] / 255,
      this.base[i + 2] / 255
    );

    for (const layer of this.layers) {
      if (layer.data == undefined || layer.mask == undefined) {
        continue;
      }

      const alpha = layer.getAlpha(i / 4);

      if (alpha === 0) {
        continue;
      }

      layer.getColor(i, this.colorHolder2);

      overBlendColors(this.colorHolder2, this.colorHolder, alpha, this.colorHolder);
    }

    this.data[i] = this.colorHolder.r * 255;
    this.data[i + 1] = this.colorHolder.g * 255;
    this.data[i + 2] = this.colorHolder.b * 255;
    this.data[i + 3] = 255;
  }
}

export class Layer {
  mask: Uint8ClampedArray | boolean;
  data: Uint8ClampedArray | Color;

  constructor(mask: Uint8ClampedArray | boolean, data: Uint8ClampedArray | Color) {
    this.mask = mask;
    this.data = data;
  }

  getAlpha(i: number): number {
    if (this.mask.constructor === Uint8ClampedArray) {
      return this.mask[i];
    } else {
      return this.mask ? 255 : 0;
    }
  }

  getColor(i: number, color: Color) {
    if (this.data.constructor === Color) {
      // @ts-ignore
      color.set(this.data);
    } else {
      color.setRGB(
        this.data[i] / 255,
        this.data[i + 1] / 255,
        this.data[i + 2] / 255
      );
    }
  }
}
