import { Bone, MeshPhongMaterial, Object3D, SkinnedMesh, Texture } from "three";
import { AbstractObject } from "./object";

export class Body extends AbstractObject {

  skeleton: Bone;
  body: SkinnedMesh;
  chassis: SkinnedMesh;

  constructor(modelUrl: string) {
    super(modelUrl);
  }

  handleModel() {
    for (let child of this.object.children) {
      if (child instanceof Bone) {
        this.skeleton = child;
      } else if (child instanceof SkinnedMesh) {
        switch (child.name) {
          case 'body':
            this.body = child;
            break;
          case 'chassis':
            this.chassis = child;
            break;
          default:
            console.warn(`unknown mesh in body model: ${child.name}`);
            break;
        }
      }
    }

    if (this.body !== undefined) {
      this.body.material = new MeshPhongMaterial();
    } else {
      console.error(`${this.url} did not contain a body mesh`);
    }

    if (this.chassis !== undefined) {
      this.chassis.material = new MeshPhongMaterial();
    } else {
      console.error(`${this.url} did not chassis a body mesh`);
    }
  }

  applyChassisTexture(diffuseMap: Texture, normalMap?: Texture) {
    const mat = <MeshPhongMaterial>this.chassis.material;
    mat.map = diffuseMap;
    mat.normalMap = normalMap;
  }

  applyBodyTexture(diffuseMap: Texture) {
    const mat = <MeshPhongMaterial>this.body.material;
    mat.map = diffuseMap;
  }
}
