import { Bone, Color, Mesh, MeshStandardMaterial, Object3D, Scene, Vector3 } from 'three';
import { AbstractObject } from '../object';
import { Body } from '../../model/body';
import { PromiseLoader } from '../../utils/loader';
import { TgaRgbaLoader } from '../../utils/tga-rgba-loader';
import { getAssetUrl } from '../../utils/network';
import { RgbaMapPipeTexture } from '../rgba-map-pipe-texture';
import { overBlendColors } from '../../utils/color';
import { disposeIfExists } from '../../utils/util';
import { Paintable } from '../paintable';
import { StaticSkin } from '../static-skin';
import { Decal } from '../../model/decal';
import { BodyTexture } from './body-texture';

class ChassisSkin extends RgbaMapPipeTexture {

  paint: Color;
  private colorHolder = new Color();
  private baseHolder = new Color();

  constructor(baseUrl, rgbaMapUrl) {
    super(baseUrl, rgbaMapUrl);
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

export class BodyModel extends AbstractObject implements Paintable {

  textureLoader = new PromiseLoader(new TgaRgbaLoader());

  skeleton: Bone;
  bodyMaterial: MeshStandardMaterial;
  chassisMaterial: MeshStandardMaterial;

  blankSkinMapUrl: string;
  blankSkinMap: Uint8ClampedArray;

  bodySkin: BodyTexture;
  chassisSkin: ChassisSkin;

  // base colors of the body
  baseSkinMapUrl: string;
  baseSkinMap: Uint8ClampedArray;

  wheelScale: number[] = [1, 1];

  hatSocket: Object3D;
  antennaSocket: Object3D;

  constructor(body: Body, decal: Decal, paints: { [key: string]: string }) {
    super(getAssetUrl(body.model));
    this.blankSkinMapUrl = getAssetUrl(body.blank_skin);
    this.baseSkinMapUrl = getAssetUrl(body.base_skin);

    this.bodySkin = this.initBodySkin(decal);

    if (body.chassis_base && body.chassis_n) {
      this.chassisSkin = new ChassisSkin(
        getAssetUrl(body.chassis_base),
        getAssetUrl(body.chassis_n)
      );
    }

    this.applyPaints(paints);
  }

  initBodySkin(decal: Decal): BodyTexture {
    return new StaticSkin(decal);
  }

  dispose() {
    super.dispose();
    disposeIfExists(this.bodyMaterial);
    disposeIfExists(this.chassisMaterial);
    disposeIfExists(this.chassisSkin);
    disposeIfExists(this.bodySkin);
  }

  load(): Promise<any> {
    const promises = [
      super.load(),
      this.textureLoader.load(this.blankSkinMapUrl),
      this.textureLoader.load(this.baseSkinMapUrl),
      this.bodySkin.load()
    ];

    if (this.chassisSkin !== undefined) {
      promises.push(this.chassisSkin.load());
    }

    return new Promise((resolve, reject) => Promise.all(promises).then(values => {
      if (values[1]) {
        this.blankSkinMap = values[1].data;
      }
      if (values[2]) {
        this.baseSkinMap = values[2].data;
      }

      this.applyDecal();
      this.updateDecal();

      if (this.chassisSkin) {
        this.chassisMaterial.map = this.chassisSkin.texture;
        this.applyChassisSkin();
      }
      resolve();
    }, reject));
  }

  handleModel(scene: Scene) {
    if ('wheelScale' in scene.userData) {
      this.wheelScale = scene.userData.wheelScale;
    }

    this.hatSocket = scene.getObjectByName('HatSocket');
    this.antennaSocket = scene.getObjectByName('AntennaSocket');

    scene.traverse(object => {
      if (object instanceof Bone && this.skeleton == undefined) {
        this.skeleton = object;
      } else if (object instanceof Mesh) {
        const mat = object.material as MeshStandardMaterial;
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

  getWheelPositions() {
    const config = {};

    this.skeleton.traverse(object => {
      if (object.name.endsWith('Disc_jnt')) {
        const wheelType = object.name.substr(0, 2).toLowerCase();
        const wheelPos = object.localToWorld(new Vector3());
        const scale = wheelType.startsWith('f') ? this.wheelScale[0] : this.wheelScale[1];

        config[wheelType] = {
          pos: wheelPos,
          scale
        };
      }
    });

    return config;
  }

  /**
   * Set the paint color of this body. This only applies to the chassis, the paint of the body is set by the skin.
   *
   * @param color paint color
   */
  setPaintColor(color: Color) {
    if (this.chassisSkin != undefined) {
      this.chassisSkin.paint = color;
    }
    this.bodySkin.bodyPaint = color;
    this.updateDecal();
    this.applyChassisSkin();
  }

  private applyDecal() {
    if (this.bodySkin != undefined) {
      this.bodySkin.blankSkinMap = this.blankSkinMap;
      this.bodySkin.baseSkinMap = this.baseSkinMap;
      this.bodyMaterial.map = this.bodySkin.getTexture();
    }
  }

  private applyPaints(paints: { [key: string]: string }) {
    if (this.bodySkin != undefined) {
      this.bodySkin.primary = new Color(paints.primary);
      this.bodySkin.accent = new Color(paints.accent);

      this.bodySkin.paint = paints.decal != undefined ? new Color(paints.decal) : undefined;

      this.bodySkin.bodyPaint = paints.body != undefined ? new Color(paints.body) : undefined;
    }

    if (this.chassisSkin != undefined) {
      this.chassisSkin.paint = paints.body != undefined ? new Color(paints.body) : undefined;
    }
  }

  private updateDecal() {
    if (this.bodySkin) {
      this.bodySkin.update();
      this.bodyMaterial.needsUpdate = true;
    }
  }

  changeDecal(decal: Decal, paints: { [key: string]: string }) {
    this.bodySkin.dispose();
    this.bodySkin = new StaticSkin(decal);
    return new Promise((resolve, reject) => {
      this.bodySkin.load().then(() => {
        this.applyDecal();
        this.applyPaints(paints);
        this.updateDecal();
        resolve();
      }, reject);
    });
  }

  setPrimaryColor(color: Color) {
    this.bodySkin.primary = color;
    this.updateDecal();
  }

  setAccentColor(color: Color) {
    this.bodySkin.accent = color;
    this.updateDecal();
  }

  setDecalPaintColor(color: Color) {
    this.bodySkin.paint = color;
    this.updateDecal();
  }
}
