export class AxleSettings {
  wheelMeshRadius = 15.0;
  wheelWidth = 15.0;
  wheelMeshOffsetSide = 0.0;
  wheelRadius = 15.0;
  wheelOffsetForward = 0.0;
  wheelOffsetSide = 0.0;

  static fromObject(obj: object): AxleSettings {
    return Object.assign(new AxleSettings(), obj);
  }
}
