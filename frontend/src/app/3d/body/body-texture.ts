import { Color, Texture } from 'three';

export interface BodyTexture {
  setPrimary(color: Color);
  setAccent(color: Color);
  setPaint(color: Color);
  setBodyPaint(color: Color);
  dispose();
  load(): Promise<any>;
  getTexture(): Texture;
}
