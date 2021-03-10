import "webcrypto-shim";

import { detect } from "detect-browser";

export default function isCryptoUseable() {
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
