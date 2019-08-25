import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { LinearEncoding, Mesh, MeshStandardMaterial, Object3D, Scene, Texture } from 'three';
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
        this.handleGltf(gltf);
        resolve();
      }, undefined, reject);
    });
  }

  protected handleGltf(gltf) {
    this.validate(gltf);
    this.scene = gltf.scene;
    traverseMaterials(this.scene, material => {
      if (material.map) {
        material.map.encoding = LinearEncoding;
      }
      if (material.emissiveMap) {
        material.emissiveMap.encoding = LinearEncoding;
      }
      if (material.map || material.emissiveMap) {
        material.needsUpdate = true;
      }
    });
    this.handleModel(gltf.scene);
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

    this.scene.position.copy(anchor.position);
    this.scene.rotation.copy(anchor.rotation);
  }

  /**
   * Dispose of the object
   */
  dispose() {
    this.scene.dispose();
  }
}

function traverseMaterials(object, callback) {
  object.traverse((node) => {
    if (!node.isMesh) {
      return;
    }
    const materials = Array.isArray(node.material) ? node.material : [node.material];
    materials.forEach(callback);
  });
}
