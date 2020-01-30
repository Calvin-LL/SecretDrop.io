import Key from "./Key";

export default class PlainMessage {
  private message: string;
  private key: Key;

  constructor(message: string, key: Key) {
    this.message = message;
    this.key = key;
  }

  encrypt() {
    return this.key.encryptString(this.message);
  }
}
