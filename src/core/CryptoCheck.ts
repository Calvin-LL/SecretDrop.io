import "webcrypto-shim";

import { detect } from "detect-browser";

export default function isCryptoUseable() {
  const browser = detect();

  return (
    window.crypto &&
    window.crypto.subtle &&
    window.crypto.subtle.importKey &&
    window.crypto.subtle.deriveKey &&
    !(browser?.name === "edge") &&
    !(browser?.name === "ie")
  );
}
