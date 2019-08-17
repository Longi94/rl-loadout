import {
  BoxGeometry,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshPhongMaterial,
  Object3D,
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

  setScale(scale: number[]) {
    if (scale != undefined) {
      this.mesh.scale.set(scale[0], scale[1], scale[2]);
      this.lineSegments.scale.set(scale[0], scale[1], scale[2]);
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

  /**
   * Set the position and rotation of the anchor to this object.
   *
   * @param anchor
   */
  applyAnchor(anchor: Object3D) {
    if (this.mesh == undefined) {
      return;
    }

    if (anchor == undefined) {
      console.warn('got undefined anchor');
      return;
    }

    this.mesh.position.set(
      anchor.position.x,
      anchor.position.y,
      anchor.position.z,
    );

    this.mesh.rotation.set(
      anchor.rotation.x,
      anchor.rotation.y,
      anchor.rotation.z,
      anchor.rotation.order,
    );

    this.lineSegments.position.set(
      anchor.position.x,
      anchor.position.y,
      anchor.position.z,
    );

    this.lineSegments.rotation.set(
      anchor.rotation.x,
      anchor.rotation.y,
      anchor.rotation.z,
      anchor.rotation.order,
    );
  }
}


export const HIT_BOX_OCTANE = [118.0074, 36.15907, 84.19941];
export const HIT_BOX_DOMINUS = [127.9268, 31.3, 83.27995];
export const HIT_BOX_PLANK = [128.8198, 29.3944, 84.67036];
export const HIT_BOX_BREAKOUT = [131.4924, 30.3, 80.521];
export const HIT_BOX_HYBRID = [127.0192, 34.15907, 82.18787];
export const HIT_BOX_BATMOBILE = [128.8198, 29.3944, 84.67036];

export function getHitboxModel(hitbox: Hitbox): number[] {
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
