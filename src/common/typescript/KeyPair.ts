import "webcrypto-shim";

import PrivateKey from "./PrivateKey";
import PublicKey from "./PublicKey";

export interface KeyPairConfig extends Partial<Omit<RsaHashedKeyGenParams, "name">> {}

export default class KeyPair {
  private cryptoKeyPair: CryptoKeyPair | undefined;
  private config: Omit<RsaHashedKeyGenParams, "name"> = {
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: "SHA-256",
  };

  constructor(config?: KeyPairConfig) {
    this.config = { ...this.config, ...config };
  }

  init() {
    return new Promise((resolve, reject) => {
      window.crypto.subtle
        .generateKey(
          {
            name: "RSA-OAEP",
            ...this.config,
          },
          true,
          ["encrypt", "decrypt"]
        )
        .then(key => {
          this.cryptoKeyPair = key;
          resolve(key);
        }, reject);
    });
  }

  async getPublicKey() {
    if (this.cryptoKeyPair) {
      const publicKey = new PublicKey();
      await publicKey.init(this.cryptoKeyPair.publicKey);
      return publicKey;
    }
    throw "Key isn't initialized";
  }

  async getPrivateKey() {
    if (this.cryptoKeyPair) {
      const privateKey = new PrivateKey();
      await privateKey.init(this.cryptoKeyPair.privateKey);
      return privateKey;
    }
    throw "Key isn't initialized";
  }
}
