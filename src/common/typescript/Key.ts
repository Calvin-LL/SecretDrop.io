import LZUTF8 from "lzutf8";

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
        if (this.format && this.keyString && this.config) {
          const decompressedKey = LZUTF8.decompress(this.keyString, {
            inputEncoding: "Base64",
          });

          window.crypto.subtle
            .importKey(this.format, decompressedKey, { name: "RSA-OAEP", ...this.config }, true, ["encrypt", "decrypt"])
            .then(key => {
              this.cryptoKey = key;
              resolve(key);
            }, reject);
        } else return reject("Key isn't initialized");
      });
  }

  encryptString(rawString: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.cryptoKey) {
        const compressedString = LZUTF8.compress(rawString);

        crypto.subtle.encrypt({ name: "RSA-OAEP" }, this.cryptoKey, compressedString).then(encryptStringBuffer => {
          const decodeString = LZUTF8.encodeBase64(new Uint8Array(encryptStringBuffer));

          resolve(decodeString);
        }, reject);
      } else return reject("Key isn't ready");
    });
  }

  decryptString(base64String: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.cryptoKey) {
        const encodeString = LZUTF8.decodeBase64(base64String);

        crypto.subtle.decrypt({ name: "RSA-OAEP" }, this.cryptoKey, encodeString).then(decryptStringBuffer => {
          const decompressedResult = LZUTF8.decompress(new Uint8Array(decryptStringBuffer));

          resolve(decompressedResult);
        }, reject);
      } else return reject("Key isn't ready");
    });
  }

  getKeyString(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.cryptoKey)
        crypto.subtle.exportKey(this.format, this.cryptoKey).then(keyArrayBuffer => {
          const compressedKey = LZUTF8.compress(keyArrayBuffer, { outputEncoding: "Base64" });

          resolve(compressedKey);
        }, reject);
      else return reject("Key isn't ready");
    });
  }
}
