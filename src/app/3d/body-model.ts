import { Bone, Mesh, MeshStandardMaterial, Scene, Texture } from "three";
import { AbstractObject } from "./object";
import { Body } from "../model/body";
import { PromiseLoader } from "../utils/loader";
import { TgaRgbaLoader } from "../utils/tga-rgba-loader";
import { getAssetUrl } from "../utils/network";

export class BodyModel extends AbstractObject {

  textureLoader = new PromiseLoader(new TgaRgbaLoader());

  skeleton: Bone;
  bodyMaterial: MeshStandardMaterial;

  blankSkinMapUrl: string;
  blankSkinMap: Uint8ClampedArray;

  // base colors of the body
  baseSkinMapUrl: string;
  baseSkinMap: Uint8ClampedArray;

  wheelScale: number[] = [1, 1];

  constructor(body: Body) {
    super(getAssetUrl(body.model));
    this.apply(body);
  }

  apply(body: Body) {
    this.url = getAssetUrl(body.model);
    this.blankSkinMapUrl = getAssetUrl(body.blank_skin);
    this.baseSkinMapUrl = getAssetUrl(body.base_skin);
    this.wheelScale = body.wheel_scale;
    this.skeleton = undefined;
    this.bodyMaterial = undefined;
    this.blankSkinMap = undefined;
    this.baseSkinMap = undefined;
  }

  load(): Promise<any> {
    return new Promise((resolve, reject) => Promise.all([
      super.load(),
      this.textureLoader.load(this.blankSkinMapUrl),
      this.textureLoader.load(this.baseSkinMapUrl)
    ]).then(values => {
      this.blankSkinMap = values[1].data;
      if (values[2]) {
        this.baseSkinMap = values[2].data;
      }
      resolve();
    }, reject));
  }

  handleModel(scene: Scene) {
    scene.traverse(object => {
      if (object instanceof Bone && this.skeleton == undefined) {
        this.skeleton = object;
      }
      if (object instanceof Mesh) {
        let mat = <MeshStandardMaterial>object.material;
        if (mat.name.toLowerCase().startsWith('body_')) {
          this.bodyMaterial = mat;
        }
      }
    });
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
        let scale = 1;

        if (wheelType.startsWith('f')) {
          const pivotJoint = bone.children.find(value => value.name.endsWith('Pivot_jnt'));
          const discJoint = pivotJoint.children[0];
          wheelPos.add(pivotJoint.position).add(discJoint.position);
          scale = this.wheelScale[0];
        } else {
          const discJoint = <Bone>bone.children.find(value => value.name.endsWith('Disc_jnt'));
          wheelPos.add(discJoint.position);
          scale = this.wheelScale[1];
        }

        config[wheelType] = {
          pos: wheelPos,
          scale: scale
        };
      }
    }

    return config;
  }
}
