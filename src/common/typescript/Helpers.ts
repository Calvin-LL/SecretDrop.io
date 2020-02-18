import { saveAs } from "file-saver";
export function animateAddTextTnElement(
  element: Element,
  s: string,
  speed: number = 5,
  property: string = "innerHTML",
  onUpdate?: () => void,
  onFinish?: () => void
) {
  let length = 0;

  const intervalId = setInterval(() => {
    if (length <= s.length) {
      // @ts-ignore
      element[property] += s.substring(length, length + speed);
      length += speed;
      onUpdate?.();
    } else {
      onFinish?.();
      clearInterval(intervalId);
    }
  }, 1);
}

export function downloadAsTxt(s: string, filename: string) {
  const blob = new Blob([s], { type: "text/plain;charset=utf-8" });
  saveAs(blob, filename);
}
