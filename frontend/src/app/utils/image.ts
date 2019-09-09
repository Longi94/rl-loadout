export enum ImageChannel {R, G, B, A}

export function getChannel(data: Uint8ClampedArray, channel: ImageChannel): Uint8ClampedArray {
  return new Uint8ClampedArray(yieldChannel(data, channel));
}

function* yieldChannel(data: Uint8ClampedArray, channel: ImageChannel) {
  for (let i = 0; i < data.length; i += 4) {
    yield data[i + channel];
  }
}
