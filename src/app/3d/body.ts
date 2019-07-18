import { Bone, MeshPhongMaterial, Scene, SkinnedMesh, Texture } from "three";
import { AbstractObject } from "./object";

export class Body extends AbstractObject {

  skeleton: Bone;
  body: SkinnedMesh;
  chassis: SkinnedMesh;

  constructor(modelUrl: string) {
    super(modelUrl);
  }

  handleModel(scene: Scene) {
    for (let child of scene.children[0].children) {
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

  getWheelPositions() {
    let config = {};

    const skeletonPos = this.skeleton.position.clone();

    for (let bone of this.skeleton.children) {
      if (bone.name.endsWith('WheelTranslation_jnt')) {
        const wheelType = bone.name.substr(0, 2).toLowerCase();
        let wheelPos = skeletonPos.clone();
        wheelPos.add(bone.position);

        if (wheelType.startsWith('f')) {
          const pivotJoint = bone.children.find(value => value.name.endsWith('Pivot_jnt'));
          const discJoint = pivotJoint.children[0];
          wheelPos.add(pivotJoint.position).add(discJoint.position);
        } else {
          const discJoint = <Bone>bone.children.find(value => value.name.endsWith('Disc_jnt'));
          wheelPos.add(discJoint.position);
        }

        config[wheelType] = wheelPos;
      }
    }

    return config;
  }
}
