import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Scene } from "three";

export abstract class AbstractObject {

  url: string;
  loader: GLTFLoader = new GLTFLoader();
  scene: Scene;

  protected constructor(modelUrl: string) {
    this.url = modelUrl;
  }

  load(): Promise<AbstractObject> {
    return new Promise((resolve, reject) => {
      this.loader.load(this.url, gltf => {
        this.scene = gltf.scene;
        this.handleModel(gltf.scene);
        resolve(this);
      }, undefined, reject);
    });
  }

  abstract handleModel(scene: Scene);

  addToScene(scene: Scene) {
    scene.add(this.scene);
  }
}
