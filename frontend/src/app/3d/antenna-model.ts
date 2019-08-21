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

  load(): Promise<any> {
    const promises = [
      this.antennaLoader.load(this.antennaUrl),
      super.load()
    ];

    return new Promise<any>((resolve, reject) => Promise.all(promises).then(values => {
      const antennaScene: Scene = values[0].scene;
      const antenna: Object3D = antennaScene.children[0];

      if (this.socket) {
        antenna.position.copy(this.socket.position);
        antenna.rotation.copy(this.socket.rotation);
      }

      this.scene.add(antenna);
      antennaScene.dispose();
      resolve();
    }, reject));
  }

  handleModel(scene: Scene) {
    this.socket = scene.getObjectByName('TopperSocket');

    if (this.socket == undefined) {
      console.warn(`${this.antennaUrl} has no topper socket.`);
    }
  }
}
