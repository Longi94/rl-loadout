import { AbstractObject } from './object';
import { Color, Mesh, MeshStandardMaterial, Scene } from 'three';
import { Topper } from '../model/topper';
import { RgbaMapPipeTexture } from './rgba-map-pipe-texture';
import { overBlendColors } from '../utils/color';
import { getAssetUrl } from '../utils/network';
import { disposeIfExists } from '../utils/util';
import { Paintable } from './paintable';
import { PaintConfig } from '../service/loadout.service';

class TopperSkin extends RgbaMapPipeTexture {

  paint: Color;
  private colorHolder = new Color();
  private baseHolder = new Color();

  constructor(baseUrl, rgbaMapUrl, paint) {
    super(baseUrl, rgbaMapUrl);

    if (paint != undefined) {
      this.paint = new Color(paint);
    }
  }

  getColor(i: number): Color {
    this.baseHolder.setRGB(
      this.base[i] / 255,
      this.base[i + 1] / 255,
      this.base[i + 2] / 255
    );

    if (this.paint != undefined && this.rgbaMap[i + 3] > 0) {
      overBlendColors(this.paint, this.baseHolder, this.rgbaMap[i + 3], this.colorHolder);
      return this.colorHolder;
    } else {
      return this.baseHolder;
    }
  }
}

export class TopperModel extends AbstractObject implements Paintable {

  material: MeshStandardMaterial;
  skin: TopperSkin;

  constructor(topper: Topper, paints: PaintConfig) {
    super(getAssetUrl(topper.model));

    if (topper.base_texture && topper.rgba_map) {
      this.skin = new TopperSkin(
        getAssetUrl(topper.base_texture),
        getAssetUrl(topper.rgba_map),
        paints.topper
      );
    }
  }

  dispose() {
    super.dispose();
    disposeIfExists(this.material);
    disposeIfExists(this.skin);
  }

  handleModel(scene: Scene) {
    scene.traverse(object => {
      if (object instanceof Mesh) {
        this.material = object.material as MeshStandardMaterial;
      }
    });
  }

  async load() {
    const superTask = super.load();

    if (this.skin) {
      await this.skin.load();
    }

    await superTask;

    if (this.skin) {
      this.material.map = this.skin.texture;
      this.applyTexture();
    }
  }

  private applyTexture() {
    if (this.skin) {
      this.skin.update();
      this.material.needsUpdate = true;
    }
  }

  setPaintColor(color: Color) {
    if (this.skin) {
      this.skin.paint = color;
      this.applyTexture();
    }
  }
}
