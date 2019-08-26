import { Color, Texture } from 'three';

export interface BodyTexture {
  primary: Color;
  accent: Color;
  paint: Color;
  bodyPaint: Color;

  blankSkinMap: Uint8ClampedArray;
  baseSkinMap: Uint8ClampedArray;

  dispose();
  load();
  update();
  getTexture(): Texture;
}
