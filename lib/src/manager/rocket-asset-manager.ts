import { RocketLoadoutService } from '../service/rl-service';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { BodyModel } from '../3d/body/body-model';
import { Decal } from '../model/decal';
import { PaintConfig } from '../model/paint-config';
import { WheelsModel } from '../3d/wheels-model';
import { RocketConfig } from '../model/rocket-config';

export class RocketAssetManager {
  private readonly rlService: RocketLoadoutService;

  constructor(private readonly config?: RocketConfig) {
    if (config == undefined) {
      this.config = new RocketConfig();
    }

    this.rlService = new RocketLoadoutService(config.backendHost);
  }

  async loadBody(id: number, paintConfig: PaintConfig): Promise<BodyModel> {
    const body = await this.rlService.getBody(id);

    const bodyModel = new BodyModel(body, Decal.NONE, paintConfig, this.config);
    await bodyModel.load();

    return bodyModel;
  }

  async loadWheel(id: number, paintConfig: PaintConfig): Promise<WheelsModel> {
    const wheel = await this.rlService.getWheel(id);

    const wheelsModel = new WheelsModel(wheel, paintConfig, this.config);
    await wheelsModel.load();

    return wheelsModel;
  }
}
