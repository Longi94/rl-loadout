import { AbstractObject } from "./object";
import { Mesh, MeshPhongMaterial, MeshStandardMaterial, Scene } from "three";
import { RgbaMapPipe } from "./rgba-map-pipe";

const WHEEL_DIAMETER = 32.626;
const FLOOR_POS = -20;

export class Wheels extends AbstractObject {

  wheels = {
    fr: undefined,
    fl: undefined,
    br: undefined,
    bl: undefined
  };

  constructor(modelUrl: string) {
    super(modelUrl);
  }

  handleModel(scene: Scene) {
    const tire = <Mesh>this.scene.children[0];
    const rim = <Mesh>this.scene.children[1];

    Wheels.fixMaterial(tire);
    Wheels.fixMaterial(rim);

    this.wheels.fr = scene.clone();
    this.wheels.fl = scene.clone();
    this.wheels.br = scene.clone();
    this.wheels.bl = scene.clone();
  }

  private static fixMaterial(mesh: Mesh) {
    const mat = new MeshPhongMaterial();
    const oldMat = <MeshStandardMaterial>mesh.material;

    mat.map = oldMat.map;
    mat.normalMap = oldMat.normalMap;
    mat.needsUpdate = true;

    mesh.material = mat;
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
}

class RimSkin extends RgbaMapPipe {

  update() {
  }
}
