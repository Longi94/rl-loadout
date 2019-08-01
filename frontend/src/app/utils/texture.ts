// @ts-ignore
const useOffscreen = typeof OffscreenCanvas !== 'undefined';

export function dataToCanvas(data: Uint8ClampedArray, width: number, height: number) {
  // @ts-ignore
  const canvas = useOffscreen ? new OffscreenCanvas(width, height) : document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');

  // create imageData object
  const imageData = context.createImageData(width, height);

  // set our buffer as source
  imageData.data.set(data);
  context.putImageData(imageData, 0, 0);

  return useOffscreen ? canvas.transferToImageBitmap() : canvas;
}
