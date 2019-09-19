import { Bone, Color, Mesh, MeshStandardMaterial, Object3D, Scene, Vector3 } from 'three';
import { AbstractObject } from '../object';
import { Body } from '../../model/body';
import { PromiseLoader } from '../../utils/loader';
import { TgaRgbaLoader } from '../../utils/tga-rgba-loader';
import { getAssetUrl } from '../../utils/network';
import { disposeIfExists } from '../../utils/util';
import { Paintable } from '../paintable';
import { StaticSkin } from '../static-skin';
import { Decal } from '../../model/decal';
import { BodyTexture } from './body-texture';
import { PaintConfig } from '../../service/loadout.service';
import { AxleSettings, WheelSettings } from '../../model/axle-settings';
import { HitboxConfig } from '../../model/hitbox-config';
import { ChassisSkin } from '../chassis-skin';


export class BodyModel extends AbstractObject implements Paintable {

  private readonly body: Body;

  textureLoader = new PromiseLoader(new TgaRgbaLoader());

  skeleton: Bone;
  bodyMaterial: MeshStandardMaterial;
  chassisMaterial: MeshStandardMaterial;

  bodySkin: BodyTexture;
  chassisSkin: ChassisSkin;

  hitboxConfig: HitboxConfig;
  wheelSettings: WheelSettings;
  wheelPositions: { [key: string]: any };

  hatSocket: Object3D;
  antennaSocket: Object3D;

  constructor(body: Body, decal: Decal, paints: PaintConfig) {
    super(getAssetUrl(body.model));

    this.body = body;

    this.bodySkin = this.initBodySkin(body, decal, paints);

    if (body.chassis_base) {
      this.chassisSkin = new ChassisSkin(
        getAssetUrl(body.chassis_base),
        getAssetUrl(body.chassis_n),
        paints
      );
    }
  }

  initBodySkin(body: Body, decal: Decal, paints: PaintConfig): BodyTexture {
    return new StaticSkin(body, decal, paints);
  }

  dispose() {
    super.dispose();
    disposeIfExists(this.bodyMaterial);
    disposeIfExists(this.chassisMaterial);
    disposeIfExists(this.chassisSkin);
    disposeIfExists(this.bodySkin);
  }

  async load() {
    const superTask = super.load();
    const bodySkinTask = this.bodySkin.load();

    if (this.chassisSkin != undefined) {
      await this.chassisSkin.load();
    }

    await superTask;
    await bodySkinTask;

    this.applyDecal();

    if (this.chassisSkin) {
      this.chassisMaterial.map = this.chassisSkin.texture.texture;
      this.chassisMaterial.needsUpdate = true;
    }
  }

  handleModel(scene: Scene) {
    if ('hitbox' in scene.userData) {
      this.hitboxConfig = scene.userData.hitbox;
    }
    if ('wheelSettings' in scene.userData) {
      this.wheelSettings = {
        frontAxle: AxleSettings.fromObject(scene.userData.wheelSettings.frontAxle),
        backAxle: AxleSettings.fromObject(scene.userData.wheelSettings.backAxle),
      };
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
        } else if (matName === 'window_material') {
          mat.envMapIntensity = 3.0;
          mat.needsUpdate = true;
        }
      }
    });

    this.getWheelPositions();
  }

  getWheelConfig() {
    return {
      settings: this.wheelSettings,
      positions: this.wheelPositions
    };
  }

  private getWheelPositions() {
    const config = {};

    this.skeleton.traverse(object => {
      if (object.name.endsWith('Disc_jnt')) {
        const wheelType = object.name.substr(0, 2).toLowerCase();
        const wheelPos = object.localToWorld(new Vector3());

        config[wheelType] = {
          pos: wheelPos
        };
      }
    });

    this.wheelPositions = config;
  }

  /**
   * Set the paint color of this body. This only applies to the chassis, the paint of the body is set by the skin.
   *
   * @param color paint color
   */
  setPaintColor(color: Color) {
    if (this.chassisSkin != undefined) {
      this.chassisSkin.setPaint(color);
    }
    this.bodySkin.setBodyPaint(color);
  }

  private applyDecal() {
    if (this.bodySkin != undefined) {
      this.bodyMaterial.map = this.bodySkin.getTexture();
    }
  }

  async changeDecal(decal: Decal, paints: PaintConfig) {
    this.bodySkin.dispose();
    this.bodySkin = new StaticSkin(this.body, decal, paints);
    await this.bodySkin.load();
    this.applyDecal();
  }

  setPrimaryColor(color: Color) {
    this.bodySkin.setPrimary(color);
  }

  setAccentColor(color: Color) {
    this.bodySkin.setAccent(color);
    if (this.chassisSkin != undefined) {
      this.chassisSkin.setAccent(color);
    }
  }

  setDecalPaintColor(color: Color) {
    this.bodySkin.setPaint(color);
  }
}
