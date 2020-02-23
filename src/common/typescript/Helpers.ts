import "webcrypto-shim";

import { saveAs } from "file-saver";

export function animateAddTextTnElement(
  element: Element,
  s: string,
  speed: number = 500,
  property: string = "innerHTML",
  onUpdate?: () => void,
  onFinish?: () => void
) {
  const stringLength = s.length;
  const textPerMil = Math.ceil(stringLength / speed);

  let mil = 1;
  let length = 0;

  if ((stringLength / textPerMil) * mil < speed) {
    mil = Math.ceil(speed / (stringLength / textPerMil));
  }

  const intervalId = setInterval(() => {
    if (length <= stringLength) {
      // @ts-ignore
      element[property] += s.substring(length, length + textPerMil);
      length += textPerMil;
      onUpdate?.();
    } else {
      onFinish?.();
      clearInterval(intervalId);
    }
  }, mil);
}

export function downloadAsTxt(s: string, filename: string) {
  const blob = new Blob([s], { type: "text/plain;charset=utf-8" });
  saveAs(blob, filename);
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
  return new Promise(function(resolve, reject) {
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
