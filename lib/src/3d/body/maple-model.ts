import { BodyModel } from './body-model';
import { Color, DataTexture, RGBAFormat } from 'three';
import { Decal } from '../../model/decal';
import { COLOR_MAPLE_ORANGE } from '../../utils/color';
import { BodyTexture } from './body-texture';
import { PaintConfig } from '../../model/paint-config';
import { Body } from '../../model/body';
import { RocketConfig } from '../../model/rocket-config';

const BODY_ORANGE = `/textures/Body_Maple1_D.tga`;
const BODY_BLUE = `/textures/Body_Maple2_D.tga`;
const CHASSIS_ORANGE = `/textures/Chassis_Maple1_D.tga`;
const CHASSIS_BLUE = `/textures/Chassis_Maple2_D.tga`;

export class MapleModel extends BodyModel {

  private bodyDataOrange: Uint8ClampedArray;
  private bodyDataBlue: Uint8ClampedArray;
  private chassisDataOrange: Uint8ClampedArray;
  private chassisDataBlue: Uint8ClampedArray;

  private bodyTexture: DataTexture;
  private chassisTexture: DataTexture;

  private readonly bodyOrangeUrl: string;
  private readonly bodyBlueUrl: string;
  private readonly chassisOrangeUrl: string;
  private readonly chassisBlueUrl: string;

  constructor(body: Body, decal: Decal, paints: PaintConfig, rocketConfig: RocketConfig) {
    super(body, decal, paints, rocketConfig);

    this.bodyOrangeUrl = rocketConfig.assetHost + BODY_ORANGE;
    this.bodyBlueUrl = rocketConfig.assetHost + BODY_BLUE;
    this.chassisOrangeUrl = rocketConfig.assetHost + CHASSIS_ORANGE;
    this.chassisBlueUrl = rocketConfig.assetHost + CHASSIS_BLUE;
  }

  initBodySkin(body: Body, decal: Decal, paints: PaintConfig, rocketConfig: RocketConfig): BodyTexture {
    return undefined;
  }

  dispose() {
    super.dispose();
    this.bodyTexture.dispose();
    this.chassisTexture.dispose();
    this.bodyDataOrange = undefined;
    this.bodyDataBlue = undefined;
    this.chassisDataOrange = undefined;
    this.chassisDataBlue = undefined;
  }

  async load() {
    const modelTask = this.loader.load(this.url);
    const bodyOrangeTask = this.textureLoader.load(this.bodyOrangeUrl);
    const bodyBlueTask = this.textureLoader.load(this.bodyBlueUrl);
    const chassisOrangeTask = this.textureLoader.load(this.chassisOrangeUrl);
    const chassisBlueTask = this.textureLoader.load(this.chassisBlueUrl);

    const gltf = await modelTask;
    this.handleGltf(gltf);

    const result = await bodyOrangeTask;

    this.bodyDataOrange = result.data;
    this.bodyDataBlue = (await bodyBlueTask).data;
    this.chassisDataOrange = (await chassisOrangeTask).data;
    this.chassisDataBlue = (await chassisBlueTask).data;

    this.bodyTexture = new DataTexture(new Uint8ClampedArray(this.bodyDataBlue), result.width, result.height, RGBAFormat);
    this.chassisTexture = new DataTexture(new Uint8ClampedArray(this.chassisDataBlue), result.width, result.height, RGBAFormat);

    this.bodyMaterial.map = this.bodyTexture;
    this.chassisMaterial.map = this.chassisTexture;

    this.applyTextures();
  }

  private applyTextures() {
    this.bodyTexture.needsUpdate = true;
    this.chassisTexture.needsUpdate = true;
    this.bodyMaterial.needsUpdate = true;
    this.chassisMaterial.needsUpdate = true;
  }

  setPaintColor(color: Color) {
  }

  async changeDecal(decal: Decal, paints: PaintConfig) {
  }

  setPrimaryColor(color: Color) {
    if (`#${color.getHexString()}` === COLOR_MAPLE_ORANGE) {
      this.bodyTexture.image.data.set(this.bodyDataOrange);
      this.chassisTexture.image.data.set(this.chassisDataOrange);
    } else {
      this.bodyTexture.image.data.set(this.bodyDataBlue);
      this.chassisTexture.image.data.set(this.chassisDataBlue);
    }
    this.applyTextures();
  }

  setAccentColor(color: Color) {
  }

  setDecalPaintColor(color: Color) {
  }
}
