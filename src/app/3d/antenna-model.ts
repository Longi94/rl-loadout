import { Antenna } from "../model/antenna";
import { AbstractObject } from "./object";
import { getAssetUrl } from "../utils/network";
import { Object3D, Scene } from "three";
import { PromiseLoader } from "../utils/loader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export class AntennaModel extends AbstractObject {

  private antennaLoader = new PromiseLoader(new GLTFLoader());

  antennaUrl: string;
  stickUrl: string;

  anchor: Object3D;

  constructor(antenna: Antenna, paints: { [key: string]: string }) {
    super(getAssetUrl(antenna.stick));
    this.antennaUrl = getAssetUrl(antenna.model);
  }

  load(): Promise<any> {
    const promises = [
      this.antennaLoader.load(this.antennaUrl),
      super.load()
    ];

    return new Promise<any>((resolve, reject) => Promise.all(promises).then(values => {
      const antennaScene: Scene = values[0].scene;
      const antenna: Object3D = antennaScene.children[0];

      if (this.anchor) {
        antenna.position.set(
          this.anchor.position.x,
          this.anchor.position.y,
          this.anchor.position.z
        );
      } else {
        console.warn('antenna stick has no anchor');
      }

      this.scene.add(antenna);
      antennaScene.dispose();
      resolve();
    }, reject));
  }

  handleModel(scene: Scene) {
    scene.traverse(object => {
      if (object.name === 'anchor') {
        this.anchor = object;
      }
    });
  }
}
