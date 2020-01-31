import PublicKey from "./PublicKey";

export default class PlainMessage {
  private message: string;
  private key: PublicKey;

  constructor(message: string, key: PublicKey) {
    this.message = message;
    this.key = key;
  }

  encrypt() {
    return this.key.encryptString(this.message);
  }
}
