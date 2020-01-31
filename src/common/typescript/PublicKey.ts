import Key from "./Key";
import LZUTF8 from "lzutf8";

export default class PublicKey extends Key {
  constructor(keyString?: string) {
    super("public", keyString);
  }

  getMaxStringLength() {
    // @ts-ignore
    const modulusLength = this.cryptoKey?.algorithm.modulusLength;
    // @ts-ignore
    const hashAlgorithm = this.cryptoKey?.algorithm.hash.name;
    const hashLength = Number.parseInt(hashAlgorithm.replace(/\D/g, ""));

    if (modulusLength && hashLength) {
      const maxLength = modulusLength / 8 - 2 * (hashLength / 8) - 2;
      return maxLength;
    }

    throw "Key isn't ready";
  }

  isStringEncryptable(rawString: string) {
    const compressedString: Uint8Array = LZUTF8.compress(rawString);

    return compressedString.length <= this.getMaxStringLength();
  }
}
