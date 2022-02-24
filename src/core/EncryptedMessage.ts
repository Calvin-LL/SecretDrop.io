import PrivateKey from "./PrivateKey";

export default class EncryptedMessage {
  private message: string;
  private key: PrivateKey;

  constructor(message: string, key: PrivateKey) {
    this.message = message;
    this.key = key;
  }

  async decrypt(): Promise<string> {
    return await this.key.decryptString(this.message);
  }
}
