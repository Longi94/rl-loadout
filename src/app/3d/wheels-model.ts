import { AbstractObject, fixMaterial } from "./object";
import { Color, Mesh, MeshPhongMaterial, Object3D, Scene, Texture } from "three";
import { RgbaMapPipe } from "./rgba-map-pipe";
import { Wheel } from "../model/wheel";
import { getAssetUrl } from "../utils/network";
import { SkeletonUtils } from "three/examples/jsm/utils/SkeletonUtils";

const WHEEL_DIAMETER = 32.626;
const FLOOR_POS = -20;

export class WheelsModel extends AbstractObject {

  wheels = {
    fr: undefined,
    fl: undefined,
    br: undefined,
    bl: undefined
  };

  paintableMaterial: MeshPhongMaterial;
  rimSkin: RimSkin;
  rimMap: Texture = new Texture();

  constructor(wheel: Wheel, paints) {
    super(getAssetUrl(wheel.model));
    if (wheel.rim_base && wheel.rim_rgb_map) {
      this.rimSkin = new RimSkin(
        getAssetUrl(wheel.rim_base),
        getAssetUrl(wheel.rim_rgb_map),
        paints.wheel
      );
    }
  }

  load(): Promise<any> {
    const promises = [super.load()];

    if (this.rimSkin) {
      promises.push(this.rimSkin.load());
    }

    return new Promise((resolve, reject) => Promise.all(promises).then(() => {
      this.applyRimSkin();
      resolve();
    }, reject));
  }

  handleModel(scene: Scene) {
    this.traverse(scene);

    this.wheels.fr = SkeletonUtils.clone(scene);
    this.wheels.fl = SkeletonUtils.clone(scene);
    this.wheels.br = SkeletonUtils.clone(scene);
    this.wheels.bl = SkeletonUtils.clone(scene);
  }

  traverse(object: Object3D) {
    if (object instanceof Mesh) {
      fixMaterial(object);

      let mat = <MeshPhongMaterial>object.material;
      if (mat.name.endsWith('_paintable')) {
        this.paintableMaterial = mat;
      }
    }

    for (let child of object.children) {
      this.traverse(child);
    }
  }

  applyWheelPositions(config) {
    for (let key of Object.keys(config)) {
      this.wheels[key].position.set(
        config[key].x,
        config[key].z,
        config[key].y
      );

      if (key.endsWith('r')) {
        this.wheels[key].rotation.set(0, Math.PI, 0);
        this.wheels[key].rotation.needsUpdate = true;
      }

      this.wheels[key].needsUpdate = true;
      this.wheels[key].position.needsUpdate = true;

      const scale = Math.abs(config[key].z - FLOOR_POS) / (WHEEL_DIAMETER / 2);
      this.wheels[key].scale.set(scale, scale, scale);
      this.wheels[key].scale.needsUpdate = true;
    }
  }

  addToScene(scene: Scene) {
    scene.add(this.wheels.fr, this.wheels.fl, this.wheels.br, this.wheels.bl);
  }

  removeFromScene(scene: Scene) {
    scene.remove(this.wheels.fr, this.wheels.fl, this.wheels.br, this.wheels.bl);
  }

  private applyRimSkin() {
    if (this.paintableMaterial != undefined && this.rimSkin != undefined) {
      this.rimSkin.update();
      this.rimMap.image = this.rimSkin.toTexture();
      this.rimMap.needsUpdate = true;
      this.paintableMaterial.map = this.rimMap;
      this.paintableMaterial.needsUpdate = true;
    }
  }

  setPaint(paint: string) {
    this.rimSkin.paint = new Color(paint);
  }

  refresh() {
    this.rimSkin.update();
    this.applyRimSkin();
  }
}

class RimSkin extends RgbaMapPipe {

  paint: Color;
  colorHolder = new Color();

  constructor(baseUrl, rgbaMapUrl, paint) {
    super(baseUrl, rgbaMapUrl);
    this.paint = new Color(paint);
  }

  getColor(i: number): Color {
    if (this.rgbaMap[i] === 0) {
      return this.paint;
    }

    this.colorHolder.setRGB(
      this.base[i] / 255,
      this.base[i + 1] / 255,
      this.base[i + 2] / 255
    );

    return this.colorHolder;
  }
}
