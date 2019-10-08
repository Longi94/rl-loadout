import { RocketLoadoutService } from '../service/rl-service';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { BodyModel } from '../3d/body/body-model';
import { Decal } from '../model/decal';
import { PaintConfig } from '../model/paint-config';
import { WheelsModel } from '../3d/wheels-model';
import { RocketConfig } from '../model/rocket-config';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { Body } from '../model/body';
import { Wheel } from '../model/wheel';

export class RocketAssetManager {
  private readonly rlService: RocketLoadoutService;

  constructor(private readonly config?: RocketConfig) {
    if (this.config == undefined) {
      this.config = new RocketConfig();
    }

    if (this.config.gltfLoader == undefined) {
      this.config.gltfLoader = new GLTFLoader();
    }

    if (this.config.dracoDecoderPath != undefined) {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath(this.config.dracoDecoderPath);
      this.config.gltfLoader.setDRACOLoader(dracoLoader);
    }

    this.rlService = new RocketLoadoutService(config.backendHost);
  }

  async loadBody(id: number, paintConfig: PaintConfig, fallback?: number): Promise<BodyModel> {
    let body: Body;

    try {
      body = await this.rlService.getBody(id);
    } catch (e) {
      if (fallback != undefined) {
        body = await this.rlService.getBody(fallback);
      }
    }

    const bodyModel = new BodyModel(body, Decal.NONE, paintConfig, this.config);
    await bodyModel.load();

    return bodyModel;
  }

  async loadWheel(id: number, paintConfig: PaintConfig, fallback?: number): Promise<WheelsModel> {
    let wheel: Wheel;

    try {
      wheel = await this.rlService.getWheel(id);
    } catch (e) {
      if (fallback != undefined) {
        wheel = await this.rlService.getWheel(fallback);
      }
    }

    const wheelsModel = new WheelsModel(wheel, paintConfig, this.config);
    await wheelsModel.load();

    return wheelsModel;
  }
}
