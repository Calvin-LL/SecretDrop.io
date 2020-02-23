import "webcrypto-shim";

export default function isCryptoUseable() {
  return window.crypto && window.crypto.subtle && window.crypto.subtle.importKey && window.crypto.subtle.deriveKey;
}
