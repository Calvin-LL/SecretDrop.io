import AesKey from "./AesKey";
import LZUTF8 from "lzutf8";
import RsaKey from "./RsaKey";

export default class PublicKey extends RsaKey {
  constructor(keyString?: string) {
    super("public", keyString);
  }

  encryptString(rawString: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.cryptoKey) {
        const compressedString: Uint8Array = LZUTF8.compress(rawString);

        window.crypto.subtle
          .encrypt({ name: "RSA-OAEP" }, this.cryptoKey, compressedString)
          .then(encryptStringBuffer => {
            const decodeString = LZUTF8.encodeBase64(new Uint8Array(encryptStringBuffer));

            resolve(decodeString);
          }, reject);
      } else return reject("Key isn't ready");
    });
  }

  wrapKeyAsUint8Array(key: AesKey): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      if (this.cryptoKey && key.cryptoKey) {
        window.crypto.subtle
          .wrapKey("raw", key.cryptoKey, this.cryptoKey, { name: "RSA-OAEP" })
          .then(encryptArrayBuffer => {
            resolve(new Uint8Array(encryptArrayBuffer));
          }, reject);
      } else return reject("Key isn't ready");
    });
  }

  // max length that can be encrypted by the public key itself
  getMaxStringLength() {
    // @ts-ignore
    const modulusLength = this.cryptoKey?.algorithm.modulusLength;
    // @ts-ignore
    const hashAlgorithm = this.cryptoKey?.algorithm.hash.name;

    if (modulusLength && hashAlgorithm) {
      const hashLength = Number.parseInt(hashAlgorithm.replace(/\D/g, ""));

      const maxLength = modulusLength / 8 - 2 * (hashLength / 8) - 2;
      return maxLength;
    }

    throw "Key isn't ready";
  }

  getCompressedStringLength(rawString: string) {
    const compressedString: Uint8Array = LZUTF8.compress(rawString);

    return compressedString.length;
  }

  isStringEncryptable(rawString: string) {
    return this.getCompressedStringLength(rawString) <= this.getMaxStringLength();
  }
}
