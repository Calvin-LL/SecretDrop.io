import "webcrypto-shim";

import { saveAs } from "file-saver";

export function animateAddTextTnElement(
  element: Element,
  s: string,
  duration: number = 500,
  property: string = "innerHTML",
  keepExistingText: boolean = true,
  onUpdate?: () => void,
  onFinish?: () => void
) {
  // @ts-ignore
  const startingString = keepExistingText ? element[property] : "";
  const stringLength = s.length;
  const startTimestamp = Date.now();

  const intervalId = setInterval(() => {
    const timeElapsed = Date.now() - startTimestamp;
    const length = Math.floor(stringLength * (timeElapsed / duration));

    if (length <= stringLength) {
      const shownString = s.substring(0, length);
      // @ts-ignore
      element[property] = startingString + fillStringWithRandom(shownString, stringLength);
      onUpdate?.();
    } else {
      // @ts-ignore
      element[property] = startingString + s;
      onFinish?.();
      clearInterval(intervalId);
    }
  }, 50);
}

export function fillElementWithRandomText(
  element: Element,
  property: string = "innerHTML",
  length: number = 0,
  onUpdate?: () => void
) {
  const intervalId = setInterval(() => {
    // @ts-ignore
    element[property] = getRandomStringOfLength(length);
    onUpdate?.();
  }, 50);

  return () => {
    clearInterval(intervalId);
  };
}

export function fillStringWithRandom(shownString: string, desiredLength: number) {
  return shownString + getRandomStringOfLength(desiredLength - shownString.length);
}

export function getRandomStringOfLength(length: number) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function getFileExtFromString(fileName: string) {
  const lastIndexOfDot = fileName.lastIndexOf(".");
  const ext = fileName.substring(lastIndexOfDot + 1);

  return ext;
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

export function calculatePreviewSize(parentWidth: number) {
  const parentWidthActual = parentWidth - 8; // for 4px padding on the sides
  for (let i = 90; i <= 120; i++) {
    const totalWidth = i + 8; // for 4px margin on the sides
    if (parentWidthActual % totalWidth === 0) return i;
  }

  return 100;
}
