import { Color, DataTexture } from 'three';
import { BLACK, overBlendColors } from '../utils/color';

export class LayeredTexture {
  readonly texture: DataTexture;
  private readonly data: Uint8ClampedArray;
  private readonly layers: Layer[] = [];
  private readonly colorHolder = new Color();
  private readonly colorHolder2 = new Color();

  constructor(private readonly base: Uint8ClampedArray, width: number, height: number) {
    this.data = new Uint8ClampedArray(base);
    this.texture = new DataTexture(this.data, width, height);
  }

  dispose() {
    this.texture.dispose();
  }

  addLayer(layer: Layer) {
    this.layers.push(layer);
  }

  getLayer(i: number): Layer {
    return this.layers[i];
  }

  /**
   * Update the texture.
   * @param mask the layer to use as an update mask, only pixels are updated where this layer has a non-zero alpha
   */
  update(mask?: number | Layer) {
    if (this.layers.length === 0) {
      return;
    }

    if (typeof mask === 'number') {
      mask = this.layers[mask];
    }

    for (let i = 0; i < this.data.length; i += 4) {
      // if (mask != undefined && mask.getAlpha(i) === 0) {
      //   continue;
      // }

      let j = 0;

      // find the last opaque pixel in the layers list to start from
      for (let k = this.layers.length - 1; k >= 0; k--) {
        if (this.layers[k].getAlpha(i / 4) === 255) {
          j = k;
          break;
        }
      }

      this.colorHolder.setRGB(
        this.base[i] / 255,
        this.base[i + 1] / 255,
        this.base[i + 2] / 255
      );

      for (; j < this.layers.length; j++) {
        const layer = this.layers[j];
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

    this.texture.needsUpdate = true;
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
    if (this.data == undefined) {
      return 0;
    }

    if (this.mask instanceof Uint8ClampedArray) {
      return this.mask[i];
    } else {
      return this.mask ? 255 : 0;
    }
  }

  getColor(i: number, color: Color) {
    if (this.data instanceof Color) {
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
