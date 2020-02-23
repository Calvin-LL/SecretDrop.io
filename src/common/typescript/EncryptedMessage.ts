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
    return await this.key.decryptString(this.message);
  }
}
