import { AbstractObject } from "./object";
import { Color, Mesh, MeshStandardMaterial, Scene } from "three";
import { RgbaMapPipeTexture } from "./rgba-map-pipe-texture";
import { Wheel } from "../model/wheel";
import { getAssetUrl } from "../utils/network";
import { SkeletonUtils } from "three/examples/jsm/utils/SkeletonUtils";
import { overBlendColors } from "../utils/color";

export class WheelsModel extends AbstractObject {

  wheels = {
    fr: undefined,
    fl: undefined,
    br: undefined,
    bl: undefined
  };

  paintableMaterial: MeshStandardMaterial;
  rimSkin: RimSkin;

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
      if (this.rimSkin){
        this.paintableMaterial.map = this.rimSkin.texture;
      }
      this.applyRimSkin();
      resolve();
    }, reject));
  }

  handleModel(scene: Scene) {
    scene.traverse(object => {
      if (object instanceof Mesh) {
        let mat = <MeshStandardMaterial>object.material;
        if (mat.name.endsWith('_paintable')) {
          this.paintableMaterial = mat;
        }
      }
    });

    this.wheels.fr = SkeletonUtils.clone(scene);
    this.wheels.fl = SkeletonUtils.clone(scene);
    this.wheels.br = SkeletonUtils.clone(scene);
    this.wheels.bl = SkeletonUtils.clone(scene);
  }

  applyWheelPositions(config) {
    for (let key of Object.keys(config)) {
      this.wheels[key].position.set(
        config[key].pos.x,
        config[key].pos.z,
        config[key].pos.y
      );

      if (key.endsWith('r')) {
        this.wheels[key].rotation.set(0, Math.PI, 0);
        this.wheels[key].rotation.needsUpdate = true;
      }

      this.wheels[key].needsUpdate = true;
      this.wheels[key].position.needsUpdate = true;

      const scale = config[key].scale;
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
      this.paintableMaterial.needsUpdate = true;
    }
  }

  setPaint(paint: string) {
    if (this.rimSkin != undefined) {
      this.rimSkin.paint = paint != undefined ? new Color(paint) : undefined;
    }
  }

  refresh() {
    this.applyRimSkin();
  }
}

class RimSkin extends RgbaMapPipeTexture {

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

    if (this.paint != undefined) {
      overBlendColors(this.paint, this.baseHolder, 255 - this.rgbaMap[i], this.colorHolder);
    } else {
      return this.baseHolder;
    }

    return this.colorHolder;
  }
}
