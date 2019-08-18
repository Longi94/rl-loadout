import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Mesh, MeshStandardMaterial, Object3D, Scene, Texture } from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

export abstract class AbstractObject {

  url: string;
  loader: GLTFLoader = new GLTFLoader();
  scene: Scene;

  protected constructor(modelUrl: string) {
    this.url = modelUrl;
    this.loader.setDRACOLoader(new DRACOLoader());
  }

  load(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loader.load(this.url, gltf => {
        this.validate(gltf);
        this.scene = gltf.scene;
        this.handleModel(gltf.scene);
        resolve();
      }, undefined, reject);
    });
  }

  private validate(gltf) {
    if (!('KHR_draco_mesh_compression' in gltf.parser.extensions)) {
      console.warn(`${this.url} is not DRACO compressed.`);
    }
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
   * @param envMap environment map
   */
  setEnvMap(envMap: Texture) {
    this.scene.traverse(object => {
      if (object instanceof Mesh) {
        const mat = object.material as MeshStandardMaterial;
        mat.envMap = envMap;
        mat.envMapIntensity = 1.0;
        mat.needsUpdate = true;
      }
    });
  }

  /**
   * Set the position and rotation of the anchor to this object.
   *
   * @param anchor the anchor object
   */
  applyAnchor(anchor: Object3D) {
    if (anchor == undefined) {
      return;
    }

    this.scene.position.set(
      anchor.position.x,
      anchor.position.y,
      anchor.position.z,
    );

    this.scene.rotation.set(
      anchor.rotation.x,
      anchor.rotation.y,
      anchor.rotation.z,
      anchor.rotation.order,
    );
  }

  /**
   * Dispose of the object
   */
  dispose() {
    this.scene.dispose();
  }
}
