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
import { PaintConfig } from '../../model/paint-config';
import { AxleSettings, WheelSettings } from '../../model/axle-settings';
import { HitboxConfig } from '../../model/hitbox-config';
import { ChassisSkin } from '../chassis-skin';
import { WheelConfig } from '../../model/wheel';
import { RocketConfig } from '../../model/rocket-config';
import { WheelsModel } from '../wheels-model';


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
  wheelConfig: WheelConfig[];

  hatSocket: Object3D;
  antennaSocket: Object3D;

  wheelsModel: WheelsModel;

  constructor(body: Body, decal: Decal, paints: PaintConfig, rocketConfig: RocketConfig) {
    super(getAssetUrl(body.model, rocketConfig), rocketConfig.gltfLoader);

    this.body = body;

    this.bodySkin = this.initBodySkin(body, decal, paints, rocketConfig);

    if (body.chassis_base) {
      this.chassisSkin = new ChassisSkin(
        getAssetUrl(body.chassis_base, rocketConfig),
        getAssetUrl(body.chassis_n, rocketConfig),
        paints
      );
    }
  }

  initBodySkin(body: Body, decal: Decal, paints: PaintConfig, rocketConfig: RocketConfig): BodyTexture {
    return new StaticSkin(body, decal, paints, rocketConfig);
  }

  dispose() {
    super.dispose();
    disposeIfExists(this.bodyMaterial);
    disposeIfExists(this.chassisMaterial);
    disposeIfExists(this.chassisSkin);
    disposeIfExists(this.bodySkin);
    this.wheelsModel = undefined;
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
      if (object['isBone'] && this.skeleton == undefined) {
        this.skeleton = object as Bone;
      } else if (object['isMesh']) {
        const mat = (object as Mesh).material as MeshStandardMaterial;
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

  protected getWheelPositions() {
    this.wheelConfig = [];

    this.skeleton.traverse(object => {
      if (object.name.endsWith('Disc_jnt')) {
        const config = new WheelConfig();

        const wheelType = object.name.substr(0, 2).toLowerCase();

        config.position = object.localToWorld(new Vector3());
        config.front = wheelType[0] === 'f';
        config.right = wheelType[1] === 'r';

        if (this.wheelSettings != undefined) {
          if (config.front) {
            config.offset = this.wheelSettings.frontAxle.wheelMeshOffsetSide;
            config.width = this.wheelSettings.frontAxle.wheelWidth;
            config.radius = this.wheelSettings.frontAxle.wheelMeshRadius;
          } else {
            config.offset = this.wheelSettings.backAxle.wheelMeshOffsetSide;
            config.width = this.wheelSettings.backAxle.wheelWidth;
            config.radius = this.wheelSettings.backAxle.wheelMeshRadius;
          }
        }

        this.wheelConfig.push(config);
      }
    });
  }

  addWheelsModel(wheelsModel: WheelsModel) {
    this.wheelsModel = wheelsModel;
    this.wheelsModel.applyWheelConfig(this.wheelConfig);
    this.wheelsModel.addToScene(this.scene);
  }

  clearWheelsModel() {
    this.wheelsModel.removeFromScene(this.scene);
    this.wheelsModel = undefined;
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

  async changeDecal(decal: Decal, paints: PaintConfig, rocketConfig: RocketConfig) {
    this.bodySkin.dispose();
    this.bodySkin = new StaticSkin(this.body, decal, paints, rocketConfig);
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
