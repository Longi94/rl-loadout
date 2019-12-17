import {
  BoxGeometry,
  EdgesGeometry,
  Euler,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshPhongMaterial,
  Scene,
  Vector3
} from 'three';
import { Hitbox, BodyModel } from 'rl-loadout-lib';

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

  applyBody(body: BodyModel) {
    const pos = new Vector3();
    let scale = new Vector3(1, 1, 1);
    let rot = new Euler();

    if (body.hitboxConfig != undefined) {
      const config = getHitboxModel(body.hitboxConfig.preset);

      if (config != undefined) {
        pos.add(config.position);
        scale = config.scale;
        rot = config.rotation;
      }

      const translate = new Vector3();

      if (body.hitboxConfig.translationX != undefined) {
        translate.setX(-body.hitboxConfig.translationX);
      }

      if (body.hitboxConfig.translationZ != undefined) {
        translate.setY(-body.hitboxConfig.translationZ);
      }

      pos.add(translate);
    }

    this.mesh.scale.copy(scale);
    this.mesh.position.copy(pos);
    this.mesh.rotation.copy(rot);
    this.lineSegments.scale.copy(scale);
    this.lineSegments.position.copy(pos);
    this.lineSegments.rotation.copy(rot);
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
  scale: Vector3;
  position: Vector3;
  rotation: Euler;
}

export const HIT_BOX_OCTANE: HitboxConfig = {
  scale: new Vector3(118.0074, 36.15907, 84.19941),
  position: new Vector3(13.87566, 20.75499),
  rotation: new Euler(0, 0, -degToRad(0.552))
};
export const HIT_BOX_DOMINUS: HitboxConfig = {
  scale: new Vector3(127.9268, 31.3, 83.27995),
  position: new Vector3(9, 15.75),
  rotation: new Euler(0, 0, -degToRad(0.963))
};
export const HIT_BOX_PLANK: HitboxConfig = {
  scale: new Vector3(128.8198, 29.3944, 84.67036),
  position: new Vector3(9.008572, 12.0942),
  rotation: new Euler(0, 0, -degToRad(0.345))
};
export const HIT_BOX_BREAKOUT: HitboxConfig = {
  scale: new Vector3(131.4924, 30.3, 80.521),
  position: new Vector3(12.5, 11.75),
  rotation: new Euler(0, 0, -degToRad(0.98))
};
export const HIT_BOX_HYBRID: HitboxConfig = {
  scale: new Vector3(127.0192, 34.15907, 82.18787),
  position: new Vector3(13.87566, 20.75499),
  rotation: new Euler(0, 0, -degToRad(0.55))
};

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
    default:
      return undefined;
  }
}

function degToRad(deg: number): number {
  return deg * (Math.PI / 180);
}
