import { Bone, Color, Mesh, MeshStandardMaterial, Object3D, Scene, Vector3 } from 'three';
import { AbstractObject } from '../object';
import { Body } from '../../model/body';
import { PromiseLoader } from '../../utils/loader';
import { TgaRgbaLoader } from '../../utils/tga-rgba-loader';
import { getAssetUrl } from '../../utils/network';
import { disposeIfExists, timed } from '../../utils/util';
import { Paintable } from '../paintable';
import { StaticSkin } from '../static-skin';
import { Decal } from '../../model/decal';
import { BodyTexture } from './body-texture';
import { Layer, LayeredTexture } from '../layered-texture';
import { getChannel, ImageChannel } from '../../utils/image';
import { BLACK } from '../../utils/color';

class ChassisSkin {

  private tgaLoader = new PromiseLoader(new TgaRgbaLoader());
  private paint: Color = BLACK;
  private paintLayer: Layer;
  texture: LayeredTexture;

  constructor(private baseUrl: string, private rgbaMapUrl: string) {
  }

  async load() {
    const baseTask = this.tgaLoader.load(this.baseUrl);
    const rgbaMapTask = this.tgaLoader.load(this.rgbaMapUrl);

    const baseResult = await baseTask;
    const rgbaMapResult = await rgbaMapTask;

    this.texture = new LayeredTexture(baseResult.data, baseResult.width, baseResult.height);

    this.paintLayer = new Layer(getChannel(rgbaMapResult.data, ImageChannel.R), this.paint);
    this.texture.addLayer(this.paintLayer);
  }

  setPaint(paint: Color) {
    this.paint = paint;
    if (this.paintLayer != undefined) {
      this.paintLayer.data = paint;
    }
  }

  updatePaint() {
    this.texture.update(this.paintLayer);
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

  hitboxConfig: { [key: string]: any };
  wheelSettings: { [key: string]: any };
  wheelPositions: { [key: string]: any };

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

  async load() {
    const superTask = super.load();
    const blankSkinTask = this.textureLoader.load(this.blankSkinMapUrl);
    const baseSkinTask = this.textureLoader.load(this.baseSkinMapUrl);
    const bodySkinTask = this.bodySkin.load();

    if (this.chassisSkin != undefined) {
      await this.chassisSkin.load();
    }

    await superTask;
    await bodySkinTask;

    this.blankSkinMap = (await blankSkinTask).data;
    this.baseSkinMap = (await baseSkinTask).data;

    this.applyDecal();
    this.updateDecal();

    if (this.chassisSkin) {
      this.chassisMaterial.map = this.chassisSkin.texture.texture;
      this.applyChassisSkin();
    }
  }

  handleModel(scene: Scene) {
    if ('hitbox' in scene.userData) {
      this.hitboxConfig = scene.userData.hitbox;
    }
    if ('wheelSettings' in scene.userData) {
      this.wheelSettings = scene.userData.wheelSettings;
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

    this.getWheelPositions();
  }

  getWheelConfig() {
    return {
      settings: this.wheelSettings,
      positions: this.wheelPositions
    };
  }

  private applyChassisSkin(paintUpdate: boolean = false) {
    if (this.chassisMaterial != undefined && this.chassisSkin != undefined) {
      timed('Chassis texture generation', () => {
        if (paintUpdate) {
          this.chassisSkin.updatePaint();
        } else {
          this.chassisSkin.texture.update();
        }
        this.chassisMaterial.needsUpdate = true;
      });
    }
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
    this.bodySkin.bodyPaint = color;
    this.updateDecal();
    this.applyChassisSkin(true);
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
      this.chassisSkin.setPaint(paints.body != undefined ? new Color(paints.body) : undefined);
    }
  }

  private updateDecal() {
    if (this.bodySkin) {
      this.bodySkin.update();
      this.bodyMaterial.needsUpdate = true;
    }
  }

  async changeDecal(decal: Decal, paints: { [key: string]: string }) {
    this.bodySkin.dispose();
    this.bodySkin = new StaticSkin(decal);
    await this.bodySkin.load();
    this.applyDecal();
    this.applyPaints(paints);
    this.updateDecal();
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
