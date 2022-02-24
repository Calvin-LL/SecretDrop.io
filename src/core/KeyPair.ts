import { ec as EC } from "elliptic";

import EcKey from "./EcKey";

export default class KeyPair extends EcKey {
  private keyPair: EC.KeyPair;

  constructor() {
    super();

    this.keyPair = this.ec.genKeyPair();
  }

  getPublicKeyString(): string {
    return this.keyPair.getPublic("hex");
  }

  getPrivateKeyString(): string {
    return this.keyPair.getPrivate("hex");
  }
}
