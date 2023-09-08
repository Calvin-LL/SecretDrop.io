import fileSaver from "file-saver";
import CardError from "./CardError";

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function scrollTo(selector: string): void {
  scrollToElement(document.querySelector(selector) as Element);
}

export function scrollToElement(element: Element | undefined): void {
  element?.scrollIntoView({
    behavior: "smooth",
  });
}
export function calculatePreviewSize(parentWidth: number): number {
  const parentWidthActual = parentWidth - 8; // for 4px padding on the sides
  for (let i = 90; i <= 120; i++) {
    const totalWidth = i + 8; // for 4px margin on the sides
    if (parentWidthActual % totalWidth === 0) return i;
  }

  return 100;
}

export function downloadAsTxt(s: string, filename: string): void {
  const blob = new Blob([s], { type: "text/plain;charset=utf-8" });
  fileSaver.saveAs(blob, filename);
}

export function checkSubtleCryptoInCard(): void {
  if (
    typeof window.crypto?.subtle?.importKey === "undefined" ||
    typeof window.crypto?.subtle?.deriveKey === "undefined" ||
    typeof window.crypto?.subtle?.encrypt === "undefined" ||
    typeof window.crypto?.subtle?.decrypt === "undefined"
  ) {
    throw new CardError(
      "Web Crypto API not supported",
      "Your browser doesn't support the Web Crypto API. Please use a modern browser."
    );
  }
}
