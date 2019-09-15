export enum ImageChannel {R, G, B, A}

export function getChannel(data: Uint8ClampedArray, channel: ImageChannel): Uint8ClampedArray {
  if (data == undefined) {
    return undefined;
  }
  return new Uint8ClampedArray(yieldChannel(data, channel));
}

function* yieldChannel(data: Uint8ClampedArray, channel: ImageChannel) {
  for (let i = 0; i < data.length; i += 4) {
    yield data[i + channel];
  }
}

export function invertChannel(channel: Uint8ClampedArray) {
  if (channel == undefined) {
    return;
  }
  for (let i = 0; i < channel.length; i++) {
    channel[i] = 255 - channel[i];
  }
}

export function getMaskPixels(mask: Uint8ClampedArray): number[] {
  if (mask == undefined) {
    return undefined;
  }
  const result = [];
  for (let i = 0; i < mask.length; i++) {
    if (mask[i] > 0) {
      result.push(i * 4);
    }
  }
  return result;
}

export function opaque(data: Uint8ClampedArray): Uint8ClampedArray {
  const newData = new Uint8ClampedArray(data);

  for (let i = 0; i < newData.length; i += 4) {
    newData[i + 3] = 255;
  }

  return newData;
}
