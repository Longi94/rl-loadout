import { BodyModel } from '../../body-model';
import { Color, DataTexture } from 'three';
import { Decal } from '../../../model/decal';
import { environment } from '../../../../environments/environment';

export const BODY_MAPLE_ID = 2919;

const BODY_ORANGE = `${environment.assetHost}/textures/Body_Maple1_D.tga`;
const BODY_BLUE = `${environment.assetHost}/textures/Body_Maple2_D.tga`;
const CHASSIS_ORANGE = `${environment.assetHost}/textures/Chassis_Maple1_D.tga`;
const CHASSIS_BLUE = `${environment.assetHost}/textures/Chassis_Maple2_D.tga`;

export class MapleModel extends BodyModel {

  private bodyDataOrange: Uint8ClampedArray;
  private bodyDataBlue: Uint8ClampedArray;
  private chassisDataOrange: Uint8ClampedArray;
  private chassisDataBlue: Uint8ClampedArray;

  private bodyTexture: DataTexture;
  private chassisTexture: DataTexture;

  dispose() {
    super.dispose();
    this.bodyTexture.dispose();
    this.chassisTexture.dispose();
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

        this.bodyTexture = new DataTexture(this.bodyDataOrange, values[0].width, values[0].height);
        this.chassisTexture = new DataTexture(this.chassisDataOrange, values[0].width, values[0].height);

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
  }

  setAccentColor(color: Color) {
  }

  setDecalPaintColor(color: Color) {
  }
}
