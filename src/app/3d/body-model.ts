import { Bone, MeshPhongMaterial, Scene, SkinnedMesh, Texture } from "three";
import { AbstractObject } from "./object";
import { environment } from "../../environments/environment";
import { Body } from "../model/body";
import { TgaRgbaLoader } from "../utils/tga-rgba-loader";
import { PromiseLoader } from "../utils/loader";
import { dataToCanvas } from "../utils/texture";

const ASSET_HOST = environment.assetHost;

export class BodyModel extends AbstractObject {

  textureLoader = new PromiseLoader(new TgaRgbaLoader());

  displacementMapUrl: string;

  skeleton: Bone;
  body: SkinnedMesh;
  chassis: SkinnedMesh;

  constructor(body: Body) {
    super(`${ASSET_HOST}/${body.model}`);

    this.displacementMapUrl = `${ASSET_HOST}/${body.displacement_map}`;
  }

  load(): Promise<any> {
    return new Promise((resolve, reject) => Promise.all([
      super.load(),
      // this.textureLoader.load(this.displacementMapUrl) TODO doesn't seem to make a difference
    ]).then(values => {
      // const displacementMap = new Texture();
      // displacementMap.image = dataToCanvas(values[1].data, values[1].width, values[1].height);
      // this.applyDisplacementMap(displacementMap);
      resolve();
    }, reject));
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

  applyDisplacementMap(map: Texture) {
    const mat = <MeshPhongMaterial>this.body.material;
    mat.displacementMap = map;
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
