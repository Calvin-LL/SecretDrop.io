import "webcrypto-shim";

import LZUTF8 from "lzutf8";

export interface AesKeyConfig extends Partial<Omit<AesKeyGenParams, "name">> {}

export default class AesKey {
  private config: Omit<AesKeyGenParams, "name"> = {
    length: 256,
  };

  public cryptoKey: CryptoKey | undefined;

  constructor(config?: AesKeyConfig) {
    this.config = { ...this.config, ...config };
  }

  init(cryptoKey?: CryptoKey) {
    if (cryptoKey) {
      this.cryptoKey = cryptoKey;
      return Promise.resolve();
    } else
      return new Promise((resolve, reject) => {
        window.crypto.subtle
          .generateKey(
            {
              name: "AES-GCM",
              ...this.config,
            },
            true,
            ["encrypt"]
          )
          .then(key => {
            this.cryptoKey = key;
            resolve();
          }, reject);
      });
  }

  encryptString(rawString: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.cryptoKey) {
        const compressedString: Uint8Array = LZUTF8.compress(rawString);
        const iv = AesKey.getRandomDataOfLength(12);

        window.crypto.subtle
          .encrypt({ name: "AES-GCM", iv }, this.cryptoKey, compressedString)
          .then(encryptStringBuffer => {
            const combinedOutput = AesKey.concatUint8Arrays(iv, new Uint8Array(encryptStringBuffer));
            const decodeString = LZUTF8.encodeBase64(combinedOutput);

            resolve(decodeString);
          }, reject);
      } else return reject("Key isn't ready");
    });
  }

  decryptString(base64String: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.cryptoKey) {
        const encryptedUint8Array = LZUTF8.decodeBase64(base64String);
        const iv = encryptedUint8Array.subarray(0, 12);
        const encodeString = encryptedUint8Array.subarray(12, encryptedUint8Array.length);

        window.crypto.subtle
          .decrypt({ name: "AES-GCM", iv }, this.cryptoKey, encodeString)
          .then(decryptStringBuffer => {
            const decompressedResult = LZUTF8.decompress(new Uint8Array(decryptStringBuffer));

            resolve(decompressedResult);
          }, reject);
      } else return reject("Key isn't ready");
    });
  }

  encryptArrayBuffer(arrayBuffer: ArrayBuffer): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      if (this.cryptoKey) {
        const iv = AesKey.getRandomDataOfLength(12);

        window.crypto.subtle.encrypt({ name: "AES-GCM", iv }, this.cryptoKey, arrayBuffer).then(encryptArrayBuffer => {
          const combinedOutput = AesKey.concatUint8Arrays(iv, new Uint8Array(encryptArrayBuffer));

          resolve(combinedOutput);
        }, reject);
      } else return reject("Key isn't ready");
    });
  }

  decryptArrayBuffer(arrayBuffer: ArrayBuffer): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      if (this.cryptoKey) {
        const encryptedUint8Array = new Uint8Array(arrayBuffer);
        const iv = encryptedUint8Array.subarray(0, 12);
        const encodeString = encryptedUint8Array.subarray(12, encryptedUint8Array.length);

        window.crypto.subtle
          .decrypt({ name: "AES-GCM", iv }, this.cryptoKey, encodeString)
          .then(decryptStringBuffer => {
            resolve(decryptStringBuffer);
          }, reject);
      } else return reject("Key isn't ready");
    });
  }

  static getRandomDataOfLength(length: number) {
    return window.crypto.getRandomValues(new Uint8Array(length));
  }

  static concatUint8Arrays(a: Uint8Array, b: Uint8Array) {
    const c = new Uint8Array(a.length + b.length);
    c.set(a, 0);
    c.set(b, a.length);
    return c;
  }
}
