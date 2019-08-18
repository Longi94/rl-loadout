import { AbstractObject } from './object';
import { Color, Mesh, MeshStandardMaterial, Scene } from 'three';
import { Topper } from '../model/topper';
import { RgbaMapPipeTexture } from './rgba-map-pipe-texture';
import { overBlendColors } from '../utils/color';
import { getAssetUrl } from '../utils/network';
import { disposeIfExists } from '../utils/util';

export class TopperModel extends AbstractObject {

  material: MeshStandardMaterial;
  skin: TopperSkin;

  constructor(topper: Topper, paints: { [key: string]: string }) {
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

  load(): Promise<any> {
    const promises = [super.load()];

    if (this.skin) {
      promises.push(this.skin.load());
    }

    return new Promise<any>((resolve, reject) => Promise.all(promises).then(() => {
      if (this.skin) {
        this.material.map = this.skin.texture;
        this.applyTexture();
      }
      resolve();
    }, reject));
  }

  private applyTexture() {
    if (this.skin) {
      this.skin.update();
      this.material.needsUpdate = true;
    }
  }

  setPaint(color: Color) {
    if (this.skin) {
      this.skin.paint = color;
    }
  }

  refresh() {
    this.applyTexture();
  }
}

class TopperSkin extends RgbaMapPipeTexture {

  paint: Color;
  colorHolder = new Color();
  baseHolder = new Color();

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
