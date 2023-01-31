export function getSecureRandomDataOfLength(length: number): Uint8Array {
  return window.crypto.getRandomValues(new Uint8Array(length));
}

export function concatBuffers(arrays: ArrayBuffer[]): ArrayBuffer {
  const totalLength = arrays.reduce((acc, array) => acc + array.byteLength, 0);
  const c = new Uint8Array(totalLength);

  let offset = 0;

  arrays.forEach((array) => {
    c.set(new Uint8Array(array), offset);
    offset += array.byteLength;
  });
  return c.buffer;
}

/**
 * @description Converts an ArrayBuffer of length 4 (uint32) to a number
 */
export function bufferToUint32(buffer: ArrayBuffer, offset = 0): number {
  const view = new DataView(buffer);

  return view.getUint32(offset, false);
}

/**
 * @description Converts an ArrayBuffer of length 1 (uint8) to a number
 */
export function bufferToUint8(buffer: ArrayBuffer, offset = 0): number {
  const view = new DataView(buffer);

  return view.getUint8(offset);
}

/**
 * @description Converts an ArrayBuffer of uint8 to an array of numbers
 */
export function bufferToUint8Array(
  buffer: ArrayBuffer,
  offset = 0,
  length?: number
): number[] {
  const view = new DataView(buffer);
  const bufferLength = length ?? buffer.byteLength;
  const result = new Array(bufferLength);

  for (let i = offset; i < bufferLength; i++) {
    result.push(view.getUint8(i));
  }

  return result;
}

/**
 * @description Converts a number to an ArrayBuffer of length 4 (uint32)
 */
export function uint32ToBuffer(num: number): ArrayBuffer {
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);
  view.setUint32(0, num, false);
  return buffer;
}

/**
 * @description Converts a number to an ArrayBuffer of length 1 (uint8)
 */
export function uint8ToBuffer(num: number): ArrayBuffer {
  const buffer = new ArrayBuffer(1);
  const view = new DataView(buffer);
  view.setUint8(0, num);
  return buffer;
}

/**
 * @description Converts a number to an ArrayBuffer of length 1 (uint8)
 */
export function uint8ArrayToBuffer(nums: number[]): ArrayBuffer {
  const buffer = new ArrayBuffer(nums.length);
  const view = new DataView(buffer);
  nums.forEach((num, i) => view.setUint8(i, num));
  return buffer;
}

// from https://stackoverflow.com/a/54646864/15101364
export function typedArrayToBuffer(array: Uint8Array): ArrayBuffer {
  return array.buffer.slice(
    array.byteOffset,
    array.byteLength + array.byteOffset
  );
}
