import { saveAs } from "file-saver";

export function scrollTo(selector: string) {
  (document.querySelector(selector) as HTMLDivElement)?.scrollIntoView({
    behavior: "smooth",
  });
}

export function animateAddTextInElement(
  startingString: string,
  addedString: string,
  duration: number = 500,
  onUpdate?: (newString: string) => void,
  onFinish?: () => void
) {
  const stringLength = addedString.length;
  const startTimestamp = Date.now();

  if (startingString && startingString.length > 0) onUpdate?.(startingString);

  const intervalId = setInterval(() => {
    const timeElapsed = Date.now() - startTimestamp;
    const length = Math.floor(stringLength * (timeElapsed / duration));

    if (length <= stringLength) {
      const shownString = addedString.substring(0, length);
      const newString =
        startingString + fillStringWithRandom(shownString, stringLength);

      onUpdate?.(newString);
    } else {
      onUpdate?.(startingString + addedString);
      onFinish?.();
      clearInterval(intervalId);
    }
  }, 50);
}

export function animateTextTransition(
  startingString: string,
  finalString: string,
  duration: number = 500,
  onUpdate?: (newString: string) => void,
  onFinish?: () => void
) {
  let stringLength = startingString.length;
  const targetLength = finalString.length;
  const startTimestamp = Date.now();

  onUpdate?.(startingString);

  const intervalId = setInterval(() => {
    if (stringLength < targetLength) stringLength++;
    else if (stringLength > targetLength) stringLength--;

    const timeElapsed = Date.now() - startTimestamp;
    const length = Math.floor(stringLength * (timeElapsed / duration));

    if (length <= stringLength || targetLength != stringLength) {
      const shownString = finalString.substring(0, length);
      const newString = fillStringWithRandom(shownString, stringLength);

      onUpdate?.(newString);
    } else {
      onUpdate?.(finalString);
      onFinish?.();
      clearInterval(intervalId);
    }
  }, 50);
}

export function fillElementWithRandomText(
  length: number = 0,
  onUpdate?: (newString: string) => void
) {
  const intervalId = setInterval(() => {
    onUpdate?.(getRandomStringOfLength(length));
  }, 50);

  return () => {
    clearInterval(intervalId);
  };
}

export function fillStringWithRandom(
  shownString: string,
  desiredLength: number
) {
  return (
    shownString + getRandomStringOfLength(desiredLength - shownString.length)
  );
}

export function getRandomStringOfLength(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function calculatePreviewSize(parentWidth: number) {
  const parentWidthActual = parentWidth - 8; // for 4px padding on the sides
  for (let i = 90; i <= 120; i++) {
    const totalWidth = i + 8; // for 4px margin on the sides
    if (parentWidthActual % totalWidth === 0) return i;
  }

  return 100;
}

export function downloadAsTxt(s: string, filename: string) {
  const blob = new Blob([s], { type: "text/plain;charset=utf-8" });
  saveAs(blob, filename);
}

export function getPredictedLengthOfEncryptedString(messageLength: number) {
  const privateKeyStringLength = 64;
  const base64Length = Math.max(4 * (messageLength + 44 / 3), 10);
  const totalLength = Math.ceil(privateKeyStringLength + base64Length + 1);

  return totalLength;
}
