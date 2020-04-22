import "webcrypto-shim";

export function getFileExtFromString(fileName: string) {
  const lastIndexOfDot = fileName.lastIndexOf(".");
  const ext = fileName.substring(lastIndexOfDot + 1);

  return ext;
}

export function getRandomDataOfLength(length: number) {
  return window.crypto.getRandomValues(new Uint8Array(length));
}

export function concatUint8Arrays(a: Uint8Array, b: Uint8Array) {
  const c = new Uint8Array(a.length + b.length);
  c.set(a, 0);
  c.set(b, a.length);
  return c;
}

export function arrayBufferToNumber(arr: ArrayBuffer) {
  const view = new DataView(arr);
  return view.getUint32(0, false);
}

export function numberToArrayBuffer(num: number) {
  const arr = new ArrayBuffer(4);
  const view = new DataView(arr);
  view.setUint32(0, num, false);
  return arr;
}

export function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  // @ts-ignore
  if (file.arrayBuffer) return file.arrayBuffer();
  return new Promise(function (resolve, reject) {
    const reader = new FileReader();

    reader.onerror = function onerror(ev) {
      reject(ev.target?.error);
    };

    reader.onload = function onload(ev) {
      resolve(ev.target?.result as ArrayBuffer);
    };

    reader.readAsArrayBuffer(file);
  });
}
