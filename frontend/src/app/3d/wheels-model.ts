import { AbstractObject } from './object';
import { Color, Mesh, MeshStandardMaterial, Object3D, Scene, Vector3 } from 'three';
import { RgbaMapPipeTexture } from './rgba-map-pipe-texture';
import { Wheel } from '../model/wheel';
import { getAssetUrl } from '../utils/network';
import { SkeletonUtils } from 'three/examples/jsm/utils/SkeletonUtils';
import { overBlendColors } from '../utils/color';
import { disposeIfExists } from '../utils/util';
import { Paintable } from './paintable';

const BASE_RADIUS = 16.313;
const BASE_WIDTH = 14.5288;

class RimSkin extends RgbaMapPipeTexture {

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

    if (this.paint != undefined) {
      overBlendColors(this.paint, this.baseHolder, 255 - this.rgbaMap[i], this.colorHolder);
      return this.colorHolder;
    } else {
      return this.baseHolder;
    }
  }
}

export class WheelsModel extends AbstractObject implements Paintable {

  wheels: { [key: string]: Object3D } = {
    fr: undefined,
    fl: undefined,
    br: undefined,
    bl: undefined
  };

  rimMaterial: MeshStandardMaterial;
  rimSkin: RimSkin;

  constructor(wheel: Wheel, paints: { [key: string]: string }) {
    super(getAssetUrl(wheel.model));
    if (wheel.rim_base && wheel.rim_rgb_map) {
      this.rimSkin = new RimSkin(
        getAssetUrl(wheel.rim_base),
        getAssetUrl(wheel.rim_rgb_map),
        paints.wheel
      );
    }
  }

  dispose() {
    super.dispose();
    disposeIfExists(this.rimMaterial);
    disposeIfExists(this.rimSkin);
    disposeIfExists(this.wheels.fr);
    disposeIfExists(this.wheels.fl);
    disposeIfExists(this.wheels.br);
    disposeIfExists(this.wheels.bl);
  }

  async load() {
    const superTask = super.load();

    if (this.rimSkin) {
      await this.rimSkin.load();
    }

    await superTask;

    if (this.rimSkin) {
      this.rimMaterial.map = this.rimSkin.texture;
    }
    this.applyRimSkin();
  }

  handleModel(scene: Scene) {
    scene.traverse(object => {
      if (object instanceof Mesh) {
        const mat = object.material as MeshStandardMaterial;
        if (mat.name.includes('rim')) {
          this.rimMaterial = mat;
        }
      }
    });

    this.wheels.fr = SkeletonUtils.clone(scene) as Object3D;
    this.wheels.fl = SkeletonUtils.clone(scene) as Object3D;
    this.wheels.br = SkeletonUtils.clone(scene) as Object3D;
    this.wheels.bl = SkeletonUtils.clone(scene) as Object3D;
  }

  applyWheelConfig(config) {
    let frontWidthScale = 1;
    let frontRadiusScale = 1;
    let backWidthScale = 1;
    let backRadiusScale = 1;
    let frontOffset = 0;
    let backOffset = 0;

    if (config.settings != undefined) {
      frontWidthScale = config.settings.frontAxle.wheelWidth / BASE_WIDTH;
      frontRadiusScale = config.settings.frontAxle.wheelMeshRadius / BASE_RADIUS;
      backWidthScale = config.settings.backAxle.wheelWidth / BASE_WIDTH;
      backRadiusScale = config.settings.backAxle.wheelMeshRadius / BASE_RADIUS;
      frontOffset = config.settings.frontAxle.wheelMeshOffsetSide;
      backOffset = config.settings.backAxle.wheelMeshOffsetSide;
    }

    for (const key of Object.keys(config.positions)) {
      const wheel = this.wheels[key];
      const position = new Vector3();

      position.copy(config.positions[key].pos);

      if (key.endsWith('l')) {
        wheel.rotation.set(0, Math.PI, 0);
      }

      if (key.startsWith('f')) {
        wheel.scale.set(frontRadiusScale, frontRadiusScale, frontWidthScale);

        if (key.endsWith('l')) {
          position.add(new Vector3(0, 0, -frontOffset));
        } else {
          position.add(new Vector3(0, 0, frontOffset));
        }
      } else {
        wheel.scale.set(backRadiusScale, backRadiusScale, backWidthScale);

        if (key.endsWith('l')) {
          position.add(new Vector3(0, 0, -backOffset));
        } else {
          position.add(new Vector3(0, 0, backOffset));
        }
      }

      wheel.position.copy(position);
    }
  }

  addToScene(scene: Scene) {
    scene.add(this.wheels.fr, this.wheels.fl, this.wheels.br, this.wheels.bl);
  }

  removeFromScene(scene: Scene) {
    scene.remove(this.wheels.fr, this.wheels.fl, this.wheels.br, this.wheels.bl);
  }

  private applyRimSkin() {
    if (this.rimMaterial != undefined && this.rimSkin != undefined) {
      this.rimSkin.update();
      this.rimMaterial.needsUpdate = true;
    }
  }

  setPaintColor(paint: Color) {
    if (this.rimSkin != undefined) {
      this.rimSkin.paint = paint;
      this.applyRimSkin();
    }
  }
}
