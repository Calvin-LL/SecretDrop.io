import {
  arrayBuffer16ToString,
  arrayBuffer8ToString,
  arrayBufferToBase64String,
  base64StringToArrayBuffer,
  stringToArrayBuffer16,
} from "./ArrayBufferHelpers";

export interface HashConfig extends Omit<RsaHashedImportParams, "name"> {}

type KeyType = "public" | "private";
type KeyFormat = "spki" | "pkcs8";

export default class Key {
  private keyString: string | undefined;
  private format: KeyFormat;
  private config: HashConfig | undefined = {
    hash: "SHA-512",
  };

  private cryptoKey: CryptoKey | undefined;

  constructor(keyType: KeyType, keyString?: string, config?: Partial<HashConfig>) {
    this.keyString = keyString;
    this.format = keyType === "public" ? "spki" : "pkcs8";
    if (this.config) this.config = { ...this.config, ...config };
  }

  init(cryptoKey?: CryptoKey) {
    if (cryptoKey) {
      this.cryptoKey = cryptoKey;
      return Promise.resolve();
    } else
      return new Promise((resolve, reject) => {
        if (this.format && this.keyString && this.config)
          window.crypto.subtle
            .importKey(
              this.format,
              base64StringToArrayBuffer(this.keyString),
              { name: "RSA-OAEP", ...this.config },
              true,
              ["encrypt", "decrypt"]
            )
            .then(key => {
              this.cryptoKey = key;
              resolve(key);
            }, reject);
        else return reject("Key isn't initialized");
      });
  }

  decryptString(base64String: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.cryptoKey)
        crypto.subtle
          .decrypt({ name: "RSA-OAEP" }, this.cryptoKey, base64StringToArrayBuffer(base64String))
          .then(publicKeyArrayBuffer => {
            resolve(arrayBuffer16ToString(publicKeyArrayBuffer));
          }, reject);
      else return reject("Key isn't ready");
    });
  }

  encryptString(rawString: string): Promise<string> {
    return new Promise((resolve, reject) => {
      console.log(stringToArrayBuffer16(rawString).byteLength);
      if (this.cryptoKey)
        crypto.subtle
          .encrypt({ name: "RSA-OAEP" }, this.cryptoKey, stringToArrayBuffer16(rawString))
          .then(publicKeyArrayBuffer => {
            resolve(arrayBufferToBase64String(publicKeyArrayBuffer));
          }, reject);
      else return reject("Key isn't ready");
    });
  }

  getString(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.cryptoKey)
        crypto.subtle.exportKey(this.format, this.cryptoKey).then(keyArrayBuffer => {
          resolve(arrayBuffer8ToString(keyArrayBuffer));
        }, reject);
      else return reject("Key isn't ready");
    });
  }
}
