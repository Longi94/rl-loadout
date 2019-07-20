import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Mesh, MeshPhongMaterial, MeshStandardMaterial, Scene } from "three";

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
}

/**
 * Changes the MeshStandardMaterial to MeshPhongMaterial while keeping the normal map.
 *
 * @param mesh
 */
export function fixMaterial(mesh: Mesh) {
  const mat = new MeshPhongMaterial();
  const oldMat = <MeshStandardMaterial>mesh.material;

  mat.map = oldMat.map;
  mat.normalMap = oldMat.normalMap;
  mat.name = oldMat.name;
  mat.needsUpdate = true;

  mesh.material = mat;
}
