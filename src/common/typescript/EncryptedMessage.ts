import LZUTF8 from "lzutf8";
import PrivateKey from "./PrivateKey";

export default class EncryptedMessage {
  private message: string;
  private key: PrivateKey;

  constructor(message: string, key: PrivateKey) {
    this.message = message;
    this.key = key;
  }

  async decrypt() {
    if (this.message.includes(",")) {
      const lastIndexOfComma = this.message.lastIndexOf(",");
      const encryptedKey = this.message.substring(0, lastIndexOfComma);
      const encryptedMessage = this.message.substring(lastIndexOfComma + 1);
      const decodedKey = LZUTF8.decodeBase64(encryptedKey);

      console.log(decodedKey.length);
      const aesKey = await this.key.unwrapUint8ArrayKey(decodedKey);
      return await aesKey.decryptString(encryptedMessage);
    } else return await this.key.decryptString(this.message);
  }
}
