import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Object3D, Scene } from "three";

export abstract class AbstractObject {

  url: string;
  loader: GLTFLoader = new GLTFLoader();
  object: Object3D;

  protected constructor(modelUrl: string) {
    this.url = modelUrl;
  }

  load(): Promise<AbstractObject> {
    return new Promise((resolve, reject) => {
      this.loader.load(this.url, gltf => {
        this.object = gltf.scene.children[0];
        this.handleModel();
        resolve(this);
      }, undefined, reject);
    });
  }

  abstract handleModel();

  addToScene(scene: Scene) {
    scene.add(this.object);
  }
}
