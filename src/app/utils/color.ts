import { Color } from "three";

export const BLACK = new Color(0, 0, 0);

export function overBlendColors(foreground: Color, background: Color, foregroundAlpha: number, holder: Color) {
  foregroundAlpha = foregroundAlpha / 255;
  let r = (foreground.r * foregroundAlpha) + (background.r * (1.0 - foregroundAlpha));
  let g = (foreground.g * foregroundAlpha) + (background.g * (1.0 - foregroundAlpha));
  let b = (foreground.b * foregroundAlpha) + (background.b * (1.0 - foregroundAlpha));
  holder.setRGB(r, g, b);
}
