import { Bone, Mesh, MeshStandardMaterial, Object3D, Scene, Texture } from "three";
import { AbstractObject } from "./object";
import { Body } from "../model/body";
import { PromiseLoader } from "../utils/loader";
import { TgaRgbaLoader } from "../utils/tga-rgba-loader";
import { getAssetUrl } from "../utils/network";

export class BodyModel extends AbstractObject {

  textureLoader = new PromiseLoader(new TgaRgbaLoader());

  displacementMapUrl: string;

  skeleton: Bone;
  bodyMaterial: MeshStandardMaterial;

  blankSkinMapUrl: string;
  blankSkinMap: Uint8ClampedArray;

  constructor(body: Body) {
    super(getAssetUrl(body.model));
    this.apply(body);
  }

  apply(body: Body) {
    this.url = getAssetUrl(body.model);
    this.displacementMapUrl = getAssetUrl(body.displacement_map);
    this.blankSkinMapUrl = getAssetUrl(body.blank_skin);
    this.skeleton = undefined;
    this.bodyMaterial = undefined;
    this.blankSkinMap = undefined;
  }

  load(): Promise<any> {
    return new Promise((resolve, reject) => Promise.all([
      super.load(),
      // this.textureLoader.load(this.displacementMapUrl) TODO doesn't seem to make a difference
      this.textureLoader.load(this.blankSkinMapUrl)
    ]).then(values => {
      // const displacementMap = new Texture();
      // displacementMap.image = dataToCanvas(values[1].data, values[1].width, values[1].height);
      // this.applyDisplacementMap(displacementMap);
      this.blankSkinMap = values[1].data;
      resolve();
    }, reject));
  }

  handleModel(scene: Scene) {
    this.iterChildren(object => {
      if (object instanceof Bone && this.skeleton == undefined) {
        this.skeleton = object;
      }
      if (object instanceof Mesh) {
        let mat = <MeshStandardMaterial>object.material;
        if (mat.name.toLowerCase().startsWith('body_')) {
          this.bodyMaterial = mat;
        }
      }
    })
  }

  applyBodyTexture(diffuseMap: Texture) {
    this.bodyMaterial.map = diffuseMap;
    this.bodyMaterial.needsUpdate = true;
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
