import { BodyModel } from './body-model';
import { Color, DataTexture, RGBAFormat } from 'three';
import { Decal } from '../../model/decal';
import { environment } from '../../../environments/environment';
import { COLOR_MAPLE_ORANGE } from '../../utils/color';
import { BodyTexture } from './body-texture';

const BODY_ORANGE = `${environment.assetHost}/textures/Body_Maple1_D.tga`;
const BODY_BLUE = `${environment.assetHost}/textures/Body_Maple2_D.tga`;
const CHASSIS_ORANGE = `${environment.assetHost}/textures/Chassis_Maple1_D.tga`;
const CHASSIS_BLUE = `${environment.assetHost}/textures/Chassis_Maple2_D.tga`;

export class MapleModel extends BodyModel {

  private bodyDataOrange: Uint8ClampedArray;
  private bodyDataBlue: Uint8ClampedArray;
  private chassisDataOrange: Uint8ClampedArray;
  private chassisDataBlue: Uint8ClampedArray;

  private bodyData: Uint8ClampedArray;
  private chassisData: Uint8ClampedArray;

  private bodyTexture: DataTexture;
  private chassisTexture: DataTexture;

  initBodySkin(decal: Decal): BodyTexture {
    return undefined;
  }

  dispose() {
    super.dispose();
    this.bodyTexture.dispose();
    this.chassisTexture.dispose();
    this.bodyData = undefined;
    this.chassisData = undefined;
    this.bodyDataOrange = undefined;
    this.bodyDataBlue = undefined;
    this.chassisDataOrange = undefined;
    this.chassisDataBlue = undefined;
  }

  load(): Promise<any> {
    const modelPromise = new Promise((resolve, reject) => {
      this.loader.load(this.url, gltf => {
        this.handleGltf(gltf);
        resolve();
      }, undefined, reject);
    });

    const promises = [
      this.textureLoader.load(BODY_ORANGE),
      this.textureLoader.load(BODY_BLUE),
      this.textureLoader.load(CHASSIS_ORANGE),
      this.textureLoader.load(CHASSIS_BLUE),
      modelPromise
    ];

    return new Promise((resolve, reject) => {
      Promise.all(promises).then(values => {
        this.bodyDataOrange = values[0].data;
        this.bodyDataBlue = values[1].data;
        this.chassisDataOrange = values[2].data;
        this.chassisDataBlue = values[3].data;

        this.bodyData = new Uint8ClampedArray(this.bodyDataBlue);
        this.chassisData = new Uint8ClampedArray(this.chassisDataBlue);

        this.bodyTexture = new DataTexture(this.bodyData, values[0].width, values[0].height, RGBAFormat);
        this.chassisTexture = new DataTexture(this.chassisData, values[0].width, values[0].height, RGBAFormat);

        this.bodyMaterial.map = this.bodyTexture;
        this.chassisMaterial.map = this.chassisTexture;

        this.applyTextures();
        resolve();
      }, reject);
    });
  }

  private applyTextures() {
    this.bodyTexture.needsUpdate = true;
    this.chassisTexture.needsUpdate = true;
    this.bodyMaterial.needsUpdate = true;
    this.chassisMaterial.needsUpdate = true;
  }

  setPaintColor(color: Color) {
  }

  changeDecal(decal: Decal, paints: { [p: string]: string }): Promise<any> {
    return Promise.resolve();
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
