import Key from "./Key";

export default class EncryptedMessage {
  private message: string;
  private key: Key;

  constructor(message: string, key: Key) {
    this.message = message;
    this.key = key;
  }

  decrypt() {
    return this.key.decryptString(this.message);
  }
}
