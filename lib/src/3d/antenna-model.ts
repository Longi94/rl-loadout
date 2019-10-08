import { Antenna } from '../model/antenna';
import { AbstractObject } from './object';
import { getAssetUrl } from '../utils/network';
import { Object3D, Scene } from 'three';
import { PromiseLoader } from '../utils/loader';
import { PaintConfig } from '../model/paint-config';
import { RocketConfig } from '../model/rocket-config';

export class AntennaModel extends AbstractObject {

  private antennaLoader: PromiseLoader;

  antennaUrl: string;

  socket: Object3D;

  constructor(antenna: Antenna, paints: PaintConfig, rocketConfig: RocketConfig) {
    super(getAssetUrl(antenna.stick, rocketConfig), rocketConfig.gltfLoader);
    this.antennaUrl = getAssetUrl(antenna.model, rocketConfig);
    this.antennaLoader = new PromiseLoader(rocketConfig.gltfLoader);
  }

  async load() {
    const antennaTask = this.antennaLoader.load(this.antennaUrl);
    await super.load();
    const gltf = await antennaTask;

    const antennaScene: Scene = gltf.scene;
    const antenna: Object3D = antennaScene.children[0];

    if (this.socket) {
      antenna.position.copy(this.socket.position);
      antenna.rotation.copy(this.socket.rotation);
    }

    this.scene.add(antenna);
    antennaScene.dispose();
  }

  handleModel(scene: Scene) {
    this.socket = scene.getObjectByName('TopperSocket');
  }
}
