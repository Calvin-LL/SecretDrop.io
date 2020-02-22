import "webcrypto-shim";

import LZUTF8 from "lzutf8";

export interface HashConfig extends Omit<RsaHashedImportParams, "name"> {}

type KeyType = "public" | "private";
type KeyFormat = "spki" | "pkcs8";

export default class Key {
  private keyType: KeyType;
  private keyString: string | undefined;
  private format: KeyFormat;

  protected cryptoKey: CryptoKey | undefined;

  constructor(keyType: KeyType, keyString?: string) {
    this.keyType = keyType;
    this.keyString = keyString;
    this.format = keyType === "public" ? "spki" : "pkcs8";
  }

  init(cryptoKey?: CryptoKey) {
    if (cryptoKey) {
      this.cryptoKey = cryptoKey;
      return Promise.resolve();
    } else
      return new Promise((resolve, reject) => {
        if (this.keyString) {
          const lastIndexOfComma = this.keyString.lastIndexOf(",");
          const hashType = this.keyString.substring(lastIndexOfComma + 1);
          const keyString = this.keyString.substring(0, lastIndexOfComma);

          const decodedKey = LZUTF8.decodeBase64(keyString);

          window.crypto.subtle
            .importKey(
              this.format,
              decodedKey,
              { name: "RSA-OAEP", hash: hashType },
              true,
              this.keyType === "public" ? ["encrypt", "wrapKey"] : ["decrypt", "unwrapKey"]
            )
            .then(key => {
              this.cryptoKey = key;
              resolve(key);
            }, reject);
        } else return reject("Key isn't initialized");
      });
  }

  getKeyString(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.cryptoKey)
        window.crypto.subtle.exportKey(this.format, this.cryptoKey).then(keyArrayBuffer => {
          let base64KeyString = LZUTF8.encodeBase64(new Uint8Array(keyArrayBuffer));

          // @ts-ignore
          base64KeyString += "," + this.cryptoKey.algorithm.hash.name;

          resolve(base64KeyString);
        }, reject);
      else return reject("Key isn't ready");
    });
  }
}
