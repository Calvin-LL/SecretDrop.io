import LZUTF8 from "lzutf8";

export interface HashConfig extends Omit<RsaHashedImportParams, "name"> {}

type KeyType = "public" | "private";
type KeyFormat = "spki" | "pkcs8";

export default class Key {
  private keyType: KeyType;
  private keyString: string | undefined;
  private format: KeyFormat;

  private cryptoKey: CryptoKey | undefined;

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
          const hashType = this.keyString.substring(lastIndexOfComma);
          const keyString = this.keyString.substring(0, lastIndexOfComma);

          const decompressedKey = LZUTF8.decompress(keyString, {
            inputEncoding: "Base64",
          });

          crypto.subtle
            .importKey(
              this.format,
              decompressedKey,
              { name: "RSA-OAEP", hash: hashType },
              true,
              this.keyType === "public" ? ["encrypt"] : ["decrypt"]
            )
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
          let compressedKey = LZUTF8.compress(keyArrayBuffer, { outputEncoding: "Base64" });

          // @ts-ignore
          compressedKey += "," + this.cryptoKey?.algorithm.hash;

          resolve(compressedKey);
        }, reject);
      else return reject("Key isn't ready");
    });
  }
}
