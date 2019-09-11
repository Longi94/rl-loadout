import { Antenna } from '../model/antenna';
import { AbstractObject } from './object';
import { getAssetUrl } from '../utils/network';
import { Object3D, Scene } from 'three';
import { PromiseLoader } from '../utils/loader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

export class AntennaModel extends AbstractObject {

  private antennaLoader: PromiseLoader;

  antennaUrl: string;

  socket: Object3D;

  constructor(antenna: Antenna, paints: { [key: string]: string }) {
    super(getAssetUrl(antenna.stick));
    this.antennaUrl = getAssetUrl(antenna.model);

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(new DRACOLoader());
    this.antennaLoader = new PromiseLoader(gltfLoader);
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
