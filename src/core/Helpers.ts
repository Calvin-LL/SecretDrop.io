import { detect } from "detect-browser";

export function isCryptoSupported(): boolean {
  const browser = detect();

  return (
    window.crypto &&
    window.crypto.subtle &&
    // @ts-expect-error typescript thinks this is always true
    window.crypto.subtle.importKey &&
    // @ts-expect-error typescript thinks this is always true
    window.crypto.subtle.deriveKey &&
    !(browser?.name === "edge") &&
    !(browser?.name === "ie")
  );
}

export function getSecureRandomDataOfLength(length: number): Uint8Array {
  return window.crypto.getRandomValues(new Uint8Array(length));
}

export function concatUint8Arrays(arrays: Uint8Array[]): Uint8Array {
  const totalLength = arrays.reduce((acc, array) => acc + array.length, 0);
  const c = new Uint8Array(totalLength);

  let offset = 0;

  arrays.forEach((array) => {
    c.set(array, offset);
    offset += array.length;
  });
  return c;
}

export function arrayBufferToNumber(arr: ArrayBuffer): number {
  const view = new DataView(arr);
  return view.getUint32(0, false);
}

export function numberToArrayBuffer(num: number): ArrayBuffer {
  const arr = new ArrayBuffer(4);
  const view = new DataView(arr);
  view.setUint32(0, num, false);
  return arr;
}
