import { Bone, Color, Mesh, MeshStandardMaterial, Object3D, Scene, Texture } from 'three';
import { AbstractObject } from './object';
import { Body } from '../model/body';
import { PromiseLoader } from '../utils/loader';
import { TgaRgbaLoader } from '../utils/tga-rgba-loader';
import { getAssetUrl } from '../utils/network';
import { RgbaMapPipeTexture } from './rgba-map-pipe-texture';
import { overBlendColors } from '../utils/color';
import { disposeIfExists } from '../utils/util';

export class BodyModel extends AbstractObject {

  textureLoader = new PromiseLoader(new TgaRgbaLoader());

  skeleton: Bone;
  bodyMaterial: MeshStandardMaterial;
  chassisMaterial: MeshStandardMaterial;

  blankSkinMapUrl: string;
  blankSkinMap: Uint8ClampedArray;

  chassisSkin: ChassisSkin;

  // base colors of the body
  baseSkinMapUrl: string;
  baseSkinMap: Uint8ClampedArray;

  wheelScale: number[] = [1, 1];

  topperAnchor: Object3D;
  antennaAnchor: Object3D;

  constructor(body: Body, paints: { [key: string]: string }) {
    super(getAssetUrl(body.model));
    this.url = getAssetUrl(body.model);
    this.blankSkinMapUrl = getAssetUrl(body.blank_skin);
    this.baseSkinMapUrl = getAssetUrl(body.base_skin);

    if (body.chassis_base && body.chassis_n) {
      this.chassisSkin = new ChassisSkin(
        getAssetUrl(body.chassis_base),
        getAssetUrl(body.chassis_n),
        paints.body
      );
    }
  }

  dispose() {
    super.dispose();
    disposeIfExists(this.bodyMaterial);
    disposeIfExists(this.chassisMaterial);
    disposeIfExists(this.chassisSkin);
    this.blankSkinMap = undefined;
    this.baseSkinMap = undefined;
  }

  load(): Promise<any> {
    const promises = [
      super.load(),
      this.textureLoader.load(this.blankSkinMapUrl),
      this.textureLoader.load(this.baseSkinMapUrl)
    ];

    if (this.chassisSkin !== undefined) {
      promises.push(this.chassisSkin.load());
    }

    return new Promise((resolve, reject) => Promise.all(promises).then(values => {
      this.blankSkinMap = values[1].data;
      if (values[2]) {
        this.baseSkinMap = values[2].data;
      }

      if (this.chassisSkin) {
        this.chassisMaterial.map = this.chassisSkin.texture;
        this.applyChassisSkin();
      }
      resolve();
    }, reject));
  }

  handleModel(scene: Scene) {
    if ('wheel_scale' in scene.userData) {
      this.wheelScale = scene.userData.wheel_scale;
    } else {
      console.warn('wheel_scale not found in body user data');
    }

    scene.traverse(object => {
      if (object.name === 'topper_anchor') {
        this.topperAnchor = object;
      } else if (object.name === 'antenna_anchor') {
        this.antennaAnchor = object;
      } else if (object instanceof Bone && this.skeleton == undefined) {
        this.skeleton = object;
      } else if (object instanceof Mesh) {
        const mat = <MeshStandardMaterial>object.material;
        const matName = mat.name.toLowerCase();
        if (matName.includes('body')) {
          this.bodyMaterial = mat;
        } else if (matName.includes('chassis')) {
          this.chassisMaterial = mat;
        }
      }
    });
  }

  private applyChassisSkin() {
    if (this.chassisMaterial != undefined && this.chassisSkin != undefined) {
      this.chassisSkin.update();
      this.chassisMaterial.needsUpdate = true;
    }
  }

  applyBodyTexture(diffuseMap: Texture) {
    this.bodyMaterial.map = diffuseMap;
    this.bodyMaterial.needsUpdate = true;
  }

  getWheelPositions() {
    const config = {};

    const skeletonPos = this.skeleton.position.clone();

    for (const bone of this.skeleton.children) {
      if (bone.name.endsWith('WheelTranslation_jnt')) {
        const wheelType = bone.name.substr(0, 2).toLowerCase();
        const wheelPos = skeletonPos.clone();
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

  /**
   * Set the paint color of this body. This only applies to the chassis, the paint of the body is set by the skin.
   *
   * @param color
   */
  setPaint(color: Color) {
    if (this.chassisSkin != undefined) {
      this.chassisSkin.paint = color;
      this.chassisSkin.update();
    }
  }
}

class ChassisSkin extends RgbaMapPipeTexture {

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

    if (this.paint != undefined && this.rgbaMap[i] > 230) {
      overBlendColors(this.paint, this.baseHolder, 255, this.colorHolder);
      return this.colorHolder;
    } else {
      return this.baseHolder;
    }
  }
}
