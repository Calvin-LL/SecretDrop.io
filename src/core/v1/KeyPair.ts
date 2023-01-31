import { ecurve } from "./ecurve";
import { PublicKey } from "./PublicKey";
import { PrivateKey } from "./PrivateKey";

export class KeyPair {
  public readonly publicKey: PublicKey;
  public readonly privateKey: PrivateKey;

  constructor() {
    const keyPair = ecurve.genKeyPair();

    this.publicKey = new PublicKey(keyPair);
    this.privateKey = new PrivateKey(keyPair);
  }
}
