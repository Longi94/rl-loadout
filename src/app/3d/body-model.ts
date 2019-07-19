import { Bone, Color, MeshPhongMaterial, Scene, SkinnedMesh, Texture } from "three";
import { AbstractObject, fixMaterial } from "./object";
import { environment } from "../../environments/environment";
import { Body } from "../model/body";
import { RgbaMapPipe } from "./rgba-map-pipe";

const ASSET_HOST = environment.assetHost;

export class BodyModel extends AbstractObject {

  displacementMapUrl: string;

  skeleton: Bone;
  body: SkinnedMesh;
  chassis: SkinnedMesh;

  chassisSkin: ChassisSkin;
  chassisMap: Texture = new Texture();

  constructor(body: Body) {
    super(`${ASSET_HOST}/${body.model}`);

    this.displacementMapUrl = `${ASSET_HOST}/${body.displacement_map}`;
    this.chassisSkin = new ChassisSkin(
      `${ASSET_HOST}/${body.chassis_base}`,
      `${ASSET_HOST}/${body.chassis_rgb_map}`,
      new Color(0, 0, 0)
    );
  }

  load(): Promise<any> {
    return new Promise((resolve, reject) => Promise.all([
      super.load(),
      // this.textureLoader.load(this.displacementMapUrl) TODO doesn't seem to make a difference
      this.chassisSkin.load()
    ]).then(() => {
      // const displacementMap = new Texture();
      // displacementMap.image = dataToCanvas(values[1].data, values[1].width, values[1].height);
      // this.applyDisplacementMap(displacementMap);
      this.applyChassisSkin();
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
      fixMaterial(this.body);
    } else {
      console.error(`${this.url} did not contain a body mesh`);
    }

    if (this.chassis !== undefined) {
      fixMaterial(this.chassis);
    } else {
      console.error(`${this.url} did not chassis a body mesh`);
    }
  }

  refresh() {
    this.chassisSkin.update();
    this.applyChassisSkin();
  }

  applyChassisSkin() {
    this.chassisSkin.update();
    const mat: MeshPhongMaterial = <MeshPhongMaterial>this.chassis.material;
    this.chassisMap.image = this.chassisSkin.toTexture();
    this.chassisMap.needsUpdate = true;
    mat.map = this.chassisMap;
    mat.needsUpdate = true;
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

class ChassisSkin extends RgbaMapPipe {

  paint: Color;

  constructor(baseUrl, rgbaMapUrl, paint) {
    super(baseUrl, rgbaMapUrl);
    this.paint = new Color(paint);
  }

  getColor(i: number): Color {
    // TODO support body paints
    return new Color(
      this.base[i] / 255,
      this.base[i + 1] / 255,
      this.base[i + 2] / 255
    );
  }
}
