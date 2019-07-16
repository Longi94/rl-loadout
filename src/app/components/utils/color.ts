import { Color } from "three";

export function blendColors(color1: Color, alpha1: number, color2: Color, alpha2: number) {
  alpha1 = alpha1 / 255;
  alpha2 = alpha2 / 255;
  let alpha = 1 - (1 - alpha2) * (1 - alpha1);
  let r = Math.round((color2.r * alpha2 / alpha) + (color1.r * alpha1 * (1 - alpha2) / alpha)); // red
  let g = Math.round((color2.g * alpha2 / alpha) + (color1.g * alpha1 * (1 - alpha2) / alpha)); // green
  let b = Math.round((color2.b * alpha2 / alpha) + (color1.b * alpha1 * (1 - alpha2) / alpha)); // blue

  return {
    color: new Color(r, g, b),
    alpha: alpha * 255
  }
}
