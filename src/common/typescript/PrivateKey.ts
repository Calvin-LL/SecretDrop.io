import Key from "./Key";
import LZUTF8 from "lzutf8";

export default class PrivateKey extends Key {
  constructor(keyString?: string) {
    super("private", keyString);
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
}
