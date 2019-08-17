import { BoxGeometry, Mesh, MeshPhongMaterial, Object3D, Scene } from "three";
import { Hitbox } from "../model/hitbox";

export class HitboxModel {
  private readonly width: number;
  private readonly height: number;
  private readonly depth: number;

  private mesh: Mesh;
  private geometry: BoxGeometry;
  private meshMaterial: MeshPhongMaterial;

  constructor(width: number, height: number, depth: number) {
    this.width = width;
    this.height = height;
    this.depth = depth;
  }

  addToScene(scene: Scene) {
    this.geometry = new BoxGeometry(this.width, this.height, this.depth);
    this.meshMaterial = new MeshPhongMaterial({
      color: '#00a200',
      transparent: true,
      opacity: 0.5
    });
    this.mesh = new Mesh(this.geometry, this.meshMaterial);
    scene.add(this.mesh);
  }

  removeFromScene(scene: Scene) {
    scene.remove(this.mesh);
    this.dispose();
  }

  dispose() {
    this.geometry.dispose();
    this.meshMaterial.dispose();
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
  }
}


export const HIT_BOX_OCTANE = new HitboxModel(118.0074, 36.15907, 84.19941);
export const HIT_BOX_DOMINUS = new HitboxModel(127.9268, 31.3, 83.27995);
export const HIT_BOX_PLANK = new HitboxModel(128.8198, 29.3944, 84.67036);
export const HIT_BOX_BREAKOUT = new HitboxModel(131.4924, 30.3, 80.521);
export const HIT_BOX_HYBRID = new HitboxModel(127.0192, 34.15907, 82.18787);
export const HIT_BOX_BATMOBILE = new HitboxModel(128.8198, 29.3944, 84.67036);

export function getHitboxModel(hitbox: Hitbox): HitboxModel {
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
