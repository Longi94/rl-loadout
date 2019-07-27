import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Mesh, MeshStandardMaterial, Object3D, Scene, Texture } from "three";

export abstract class AbstractObject {

  url: string;
  loader: GLTFLoader = new GLTFLoader();
  scene: Scene;

  protected constructor(modelUrl: string) {
    this.url = modelUrl;
  }

  load(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loader.load(this.url, gltf => {
        this.scene = gltf.scene;
        this.handleModel(gltf.scene);
        resolve();
      }, undefined, reject);
    });
  }

  abstract handleModel(scene: Scene);

  addToScene(scene: Scene) {
    scene.add(this.scene);
  }

  removeFromScene(scene: Scene) {
    scene.remove(this.scene);
  }

  /**
   * Set the environment map to all objects in this scene
   *
   * @param envMap
   */
  setEnvMap(envMap: Texture) {
    this.scene.traverse(object => {
      if (object instanceof Mesh) {
        let mat = <MeshStandardMaterial>object.material;
        mat.envMap = envMap;
        mat.envMapIntensity = 1.0;
        mat.needsUpdate = true;
      }
    });
  }
}
