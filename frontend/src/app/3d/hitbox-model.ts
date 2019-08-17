import {
  BoxGeometry,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshPhongMaterial,
  Scene
} from "three";
import { Hitbox } from "../model/hitbox";

export class HitboxModel {

  private readonly mesh: Mesh;
  private readonly geometry: BoxGeometry;
  private readonly meshMaterial: MeshPhongMaterial;
  private readonly lineMaterial: LineBasicMaterial;
  private readonly lineSegments: LineSegments;
  private readonly edges: EdgesGeometry;

  constructor() {
    this.geometry = new BoxGeometry(1, 1, 1);
    this.lineMaterial = new LineBasicMaterial({color: '#00ff00'});
    this.meshMaterial = new MeshPhongMaterial({
      color: '#00a200',
      transparent: true,
      opacity: 0.5
    });
    this.mesh = new Mesh(this.geometry, this.meshMaterial);
    this.edges = new EdgesGeometry(this.geometry);
    this.lineSegments = new LineSegments(this.edges, this.lineMaterial);
  }

  applyConfig(config: HitboxConfig) {
    if (config != undefined) {
      this.mesh.scale.set(config.width, config.height, config.depth);
      this.mesh.position.set(config.posX, config.posY, 0);
      this.mesh.rotation.set(0, 0, -degToRad(config.rotZ));
      this.lineSegments.scale.set(config.width, config.height, config.depth);
      this.lineSegments.position.set(config.posX, config.posY, 0);
      this.lineSegments.rotation.set(0, 0, -degToRad(config.rotZ));
    }
  }

  addToScene(scene: Scene) {
    scene.add(this.mesh);
    scene.add(this.lineSegments);
  }

  removeFromScene(scene: Scene) {
    scene.remove(this.mesh);
    scene.remove(this.lineSegments);
  }

  dispose() {
    this.geometry.dispose();
    this.meshMaterial.dispose();
    this.lineMaterial.dispose();
    this.edges.dispose();
  }
}

class HitboxConfig {
  width: number;
  height: number;
  depth: number;
  posX: number;
  posY: number;
  rotZ: number;
}

export const HIT_BOX_OCTANE: HitboxConfig = {
  width: 118.0074,
  height: 36.15907,
  depth: 84.19941,
  posX: 13.87566,
  posY: 20.75499,
  rotZ: 0.552
};
export const HIT_BOX_DOMINUS: HitboxConfig = {
  width: 127.9268,
  height: 31.3,
  depth: 83.27995,
  posX: 9,
  posY: 15.75,
  rotZ: 0.963
};
export const HIT_BOX_PLANK: HitboxConfig = {
  width: 128.8198,
  height: 29.3944,
  depth: 84.67036,
  posX: 9.008572,
  posY: 12.0942,
  rotZ: 0.345
};
export const HIT_BOX_BREAKOUT: HitboxConfig = {
  width: 131.4924,
  height: 30.3,
  depth: 80.521,
  posX: 12.5,
  posY: 11.75,
  rotZ: 0.98
};
export const HIT_BOX_HYBRID: HitboxConfig = {
  width: 127.0192,
  height: 34.15907,
  depth: 82.18787,
  posX: 13.87566,
  posY: 20.75499,
  rotZ: 0.55
};
export const HIT_BOX_BATMOBILE: HitboxConfig = HIT_BOX_PLANK;

export function getHitboxModel(hitbox: Hitbox): HitboxConfig {
  switch (hitbox) {
    case Hitbox.OCTANE:
      return HIT_BOX_OCTANE;
    case Hitbox.DOMINUS:
      return HIT_BOX_DOMINUS;
    case Hitbox.PLANK:
      return HIT_BOX_PLANK;
    case Hitbox.BREAKOUT:
      return HIT_BOX_BREAKOUT;
    case Hitbox.HYBRID:
      return HIT_BOX_HYBRID;
    case Hitbox.BATMOBILE:
      return HIT_BOX_BATMOBILE;
  }
}

function degToRad(deg: number): number {
  return deg * (Math.PI / 180);
}
