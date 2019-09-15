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
import { Layer, LayeredTexture } from '../layered-texture';
import { getChannel, ImageChannel } from '../../utils/image';
import { BLACK } from '../../utils/color';
import { PaintConfig } from '../../service/loadout.service';
import { AxleSettings, WheelSettings } from '../../model/axle-settings';
import { HitboxConfig } from '../../model/hitbox-config';

class ChassisSkin {

  private tgaLoader = new PromiseLoader(new TgaRgbaLoader());
  private paint: Color = BLACK;
  private paintLayer: Layer;
  private paintPixels: number[];
  texture: LayeredTexture;

  constructor(private baseUrl: string, private rgbaMapUrl: string, paints: PaintConfig) {
    this.paint = paints.body;
  }

  dispose() {
    this.texture.dispose();
  }

  async load() {
    const baseTask = this.tgaLoader.load(this.baseUrl);
    const rgbaMapTask = this.tgaLoader.load(this.rgbaMapUrl);

    const baseResult = await baseTask;
    const rgbaMapResult = await rgbaMapTask;

    this.texture = new LayeredTexture(baseResult.data, baseResult.width, baseResult.height);

    const alphaChannel = getChannel(rgbaMapResult.data, ImageChannel.R);

    this.paintPixels = [];
    for (let i = 0; i < alphaChannel.length; i++) {
      if (alphaChannel[i] > 0) {
        this.paintPixels.push(i * 4);
      }
    }

    this.paintLayer = new Layer(alphaChannel, this.paint);
    this.texture.addLayer(this.paintLayer);
    this.texture.update();
  }

  setPaint(paint: Color) {
    this.paint = paint;
    if (this.paintLayer != undefined) {
      this.paintLayer.data = paint;
    }
    this.updatePaint();
  }

  updatePaint() {
    this.texture.update(this.paintPixels);
  }
}

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

    if (body.chassis_base && body.chassis_n) {
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
    this.updateDecal();

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
    this.updateDecal();
  }

  private applyDecal() {
    if (this.bodySkin != undefined) {
      this.bodyMaterial.map = this.bodySkin.getTexture();
    }
  }

  private updateDecal() {
    if (this.bodySkin) {
      this.bodyMaterial.needsUpdate = true;
    }
  }

  async changeDecal(decal: Decal, paints: PaintConfig) {
    this.bodySkin.dispose();
    this.bodySkin = new StaticSkin(this.body, decal, paints);
    await this.bodySkin.load();
    this.applyDecal();
    this.updateDecal();
  }

  setPrimaryColor(color: Color) {
    this.bodySkin.setPrimary(color);
    this.updateDecal();
  }

  setAccentColor(color: Color) {
    this.bodySkin.setAccent(color);
    this.updateDecal();
  }

  setDecalPaintColor(color: Color) {
    this.bodySkin.setPaint(color);
    this.updateDecal();
  }
}
