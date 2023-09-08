export class TextAnimator {
  private stopFillElementWithRandomText: () => void = () => {};
  private stopAnimateTextTransition: () => void = () => {};
  private animationStartTime: number = 0;

  constructor(
    private readonly type: "encrypt" | "decrypt",
    private readonly setText: (s: string) => void
  ) {
    this.setText = setText;
  }

  startAnimation(plainTextLength: number) {
    this.stopPreviousAnimation();

    this.animationStartTime = Date.now();
    const predictedLength =
      this.type === "encrypt"
        ? getPredictedLengthOfEncryptedString(plainTextLength)
        : getPredictedLengthOfDecryptedString(plainTextLength);
    this.stopFillElementWithRandomText = fillElementWithRandomText(
      predictedLength,
      this.setText
    );
  }

  endAnimation(
    encryptedText: string,
    elementText: string,
    onFinish?: () => void
  ) {
    const endTime = Date.now();
    const timeTaken = endTime - this.animationStartTime;
    const remainingTime = Math.max(1000, 3000 - timeTaken);

    this.animationStartTime = 0;

    this.stopFillElementWithRandomText();
    this.stopAnimateTextTransition = animateTextTransition(
      elementText,
      encryptedText,
      remainingTime,
      this.setText,
      onFinish
    );
  }

  stopPreviousAnimation() {
    this.stopFillElementWithRandomText();
    this.stopAnimateTextTransition();
  }
}

export function animateAddTextInElement(
  startingString: string,
  addedString: string,
  duration = 500,
  onUpdate?: (newString: string) => void,
  onFinish?: () => void
): () => void {
  const stringLength = addedString.length;
  const startTimestamp = Date.now();

  if (startingString && startingString.length > 0) {
    onUpdate?.(
      fillStringWithRandom(
        startingString,
        (startingString + addedString).length
      )
    );
  }

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

  return () => clearInterval(intervalId);
}

function animateTextTransition(
  startingString: string,
  finalString: string,
  duration = 500,
  onUpdate?: (newString: string) => void,
  onFinish?: () => void
): () => void {
  const initialLength = startingString.length;
  const targetLength = finalString.length;
  const lengthDifference = finalString.length - startingString.length;
  const startTimestamp = Date.now();

  onUpdate?.(startingString);
  const intervalId = setInterval(() => {
    const timeElapsed = Date.now() - startTimestamp;
    const timeElapsedRatio = Math.min(timeElapsed / duration, 1);
    const stringLengthΔ = Math.floor(lengthDifference * timeElapsedRatio);
    const stringLength = initialLength + stringLengthΔ;
    const finalStringShownlength = Math.floor(stringLength * timeElapsedRatio);

    if (
      finalStringShownlength != targetLength ||
      stringLength != targetLength
    ) {
      const shownString = finalString.substring(0, finalStringShownlength);
      const newString = fillStringWithRandom(shownString, stringLength);

      onUpdate?.(newString);
    } else {
      onUpdate?.(finalString);
      onFinish?.();
      clearInterval(intervalId);
    }
  }, 50);

  return () => clearInterval(intervalId);
}

function fillElementWithRandomText(
  length = 0,
  onUpdate?: (newString: string) => void
): () => void {
  const intervalId = setInterval(() => {
    onUpdate?.(getRandomStringOfLength(length));
  }, 50);

  return () => clearInterval(intervalId);
}

function fillStringWithRandom(
  shownString: string,
  desiredLength: number
): string {
  return (
    shownString + getRandomStringOfLength(desiredLength - shownString.length)
  );
}

function getRandomStringOfLength(length: number): string {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function getPredictedLengthOfEncryptedString(messageLength: number): number {
  return Math.ceil(1.33 * messageLength) + 104;
}

function getPredictedLengthOfDecryptedString(stringLength: number): number {
  return Math.ceil((stringLength - 104) / 1.33);
}
