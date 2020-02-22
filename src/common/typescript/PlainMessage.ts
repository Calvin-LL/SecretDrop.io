import AesKey from "./AesKey";
import LZUTF8 from "lzutf8";
import PublicKey from "./PublicKey";

export default class PlainMessage {
  private message: string;
  private key: PublicKey;

  constructor(message: string, key: PublicKey) {
    this.message = message;
    this.key = key;
  }

  async encrypt() {
    if (this.key.isStringEncryptable(this.message)) {
      return await this.key.encryptString(this.message);
    } else {
      const maxStringLength = this.key.getMaxStringLength();
      let keySize = 256;

      if (maxStringLength < keySize) keySize = 192;
      if (maxStringLength < keySize) keySize = 128;
      if (maxStringLength < keySize) throw "Key too short";

      const aesKey: AesKey = new AesKey();
      await aesKey.init();

      const wrappedKey = await this.key.wrapKeyAsUint8Array(aesKey);
      const encryptString = await aesKey.encryptString(this.message);
      console.log(wrappedKey.length);
      return LZUTF8.encodeBase64(wrappedKey) + "," + encryptString;
    }
  }
}
