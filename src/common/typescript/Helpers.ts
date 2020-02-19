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
  console.log(textPerMil, mil, (stringLength / textPerMil) * mil);
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
