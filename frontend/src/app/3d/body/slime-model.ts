import { BodyModel } from './body-model';
import { Color, DataTexture, MeshStandardMaterial, RGBAFormat, Scene } from 'three';
import { Decal } from '../../model/decal';
import { environment } from '../../../environments/environment';
import { COLOR_MAPLE_ORANGE } from '../../utils/color';
import { BodyTexture } from './body-texture';
import { traverseMaterials } from '../object';

const BODY_ORANGE = `${environment.assetHost}/textures/Body_Slime1_D.tga`;
const BODY_BLUE = `${environment.assetHost}/textures/Body_Slime2_D.tga`;
const CHASSIS_ORANGE = `${environment.assetHost}/textures/Chassis_Slime_D.tga`;
const CHASSIS_BLUE = `${environment.assetHost}/textures/Chassis_Slime2_D.tga`;

export class SlimeModel extends BodyModel {

  private bodyDataOrange: Uint8ClampedArray;
  private bodyDataBlue: Uint8ClampedArray;
  private chassisDataOrange: Uint8ClampedArray;
  private chassisDataBlue: Uint8ClampedArray;

  private bodyData: Uint8ClampedArray;
  private chassisData: Uint8ClampedArray;

  private bodyTexture: DataTexture;
  private chassisTexture: DataTexture;

  private lensMaterial: MeshStandardMaterial;

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

  async load() {
    const modelTask = this.loader.load(this.url);
    const bodyOrangeTask = this.textureLoader.load(BODY_ORANGE);
    const bodyBlueTask = this.textureLoader.load(BODY_BLUE);
    const chassisOrangeTask = this.textureLoader.load(CHASSIS_ORANGE);
    const chassisBlueTask = this.textureLoader.load(CHASSIS_BLUE);

    const gltf = await modelTask;
    this.handleGltf(gltf);

    const result = await bodyOrangeTask;

    this.bodyDataOrange = result.data;
    this.bodyDataBlue = (await bodyBlueTask).data;
    this.chassisDataOrange = (await chassisOrangeTask).data;
    this.chassisDataBlue = (await chassisBlueTask).data;

    this.bodyData = new Uint8ClampedArray(this.bodyDataBlue);
    this.chassisData = new Uint8ClampedArray(this.chassisDataBlue);

    this.bodyTexture = new DataTexture(this.bodyData, result.width, result.height, RGBAFormat);
    this.chassisTexture = new DataTexture(this.chassisData, result.width, result.height, RGBAFormat);

    this.bodyMaterial.map = this.bodyTexture;
    this.chassisMaterial.map = this.chassisTexture;

    this.lensMaterial.color.setRGB(0, 0, 0.8);

    this.applyTextures();
  }

  handleModel(scene: Scene) {
    super.handleModel(scene);

    traverseMaterials(scene, material => {
      if (material.name === 'MAT_Slime_HeadlightLens_VertColor') {
        this.lensMaterial = material;
      }
    });
  }

  private applyTextures() {
    this.bodyTexture.needsUpdate = true;
    this.chassisTexture.needsUpdate = true;
    this.bodyMaterial.needsUpdate = true;
    this.chassisMaterial.needsUpdate = true;
    this.lensMaterial.needsUpdate = true;
  }

  setPaintColor(color: Color) {
  }

  async changeDecal(decal: Decal, paints: { [p: string]: string }) {
  }

  setPrimaryColor(color: Color) {
    if (`#${color.getHexString()}` === COLOR_MAPLE_ORANGE) {
      this.bodyTexture.image.data.set(this.bodyDataOrange);
      this.chassisTexture.image.data.set(this.chassisDataOrange);
      this.lensMaterial.color.setRGB(0.8, 0, 0);
    } else {
      this.bodyTexture.image.data.set(this.bodyDataBlue);
      this.chassisTexture.image.data.set(this.chassisDataBlue);
      this.lensMaterial.color.setRGB(0, 0, 0.8);
    }
    this.applyTextures();
  }

  setAccentColor(color: Color) {
  }

  setDecalPaintColor(color: Color) {
  }
}
