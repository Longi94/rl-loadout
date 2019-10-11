import { Color } from "three";

/**
 * Get the text color for the background to make it readable.
 * https://www.w3.org/TR/AERT/#color-contrast
 *
 * @param backgroundColor color of background in #FFFFFF format
 */
export function getTextColor(backgroundColor: Color) {
  if (backgroundColor == undefined) {
    return 'white';
  }
  const o = Math.round(((backgroundColor.r * 76245) + (backgroundColor.g * 149685) + (backgroundColor.b * 29070)) / 1000);
  return (o > 125) ? 'black' : 'white';
}
