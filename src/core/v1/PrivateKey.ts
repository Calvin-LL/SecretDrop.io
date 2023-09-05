import { ec } from "elliptic";
// @ts-expect-error the ts doesn't have that file
import KeyPair from "elliptic/lib/elliptic/ec/key";

import { AESKey } from "./AESKey";
import { PublicKey } from "./PublicKey";
import { base64ToBuffer, bufferToBase64 } from "./base64";
import { V1_VERSION_CODE, V1_VERSION_CODE_BUFFER } from "./constants";
import { ecurve } from "./ecurve";
import { bufferToUint8, concatBuffers, uint8ArrayToBuffer } from "./helpers";

export class PrivateKey {
  readonly #key: ec.KeyPair;

  constructor(key: string | ec.KeyPair) {
    if (typeof key === "string") {
      const versionKeyBuffer = base64ToBuffer(key);
      const versionCode = bufferToUint8(versionKeyBuffer);
      if (versionCode !== V1_VERSION_CODE) {
        throw new Error("Invalid version code in key");
      }
      const keyBuffer = new Uint8Array(versionKeyBuffer, 1);

      this.#key = ecurve.keyFromPrivate(keyBuffer);
    } else if (key instanceof KeyPair) {
      this.#key = key as ec.KeyPair;
    } else {
      throw new Error("Invalid key type");
    }
  }

  async #getSharedSecret(publicKey: PublicKey): Promise<CryptoKey> {
    const sharedSecretBuffer = new Uint8Array(
      this.#key.derive(publicKey.getPublicBasePoint()).toArray()
    );

    return window.crypto.subtle.importKey(
      "raw",
      sharedSecretBuffer,
      "PBKDF2",
      false,
      ["deriveKey"]
    );
  }

  toString(): string {
    const privateKeyBuffer = Uint8Array.from(this.#key.getPrivate().toArray());

    return bufferToBase64(
      concatBuffers([V1_VERSION_CODE_BUFFER, privateKeyBuffer])
    );
  }

  async encryptBuffer(
    publicKey: PublicKey,
    plainBuffer: ArrayBuffer
  ): Promise<ArrayBuffer> {
    const sharedSecret = await this.#getSharedSecret(publicKey);
    const aesKey = new AESKey("encrypt", sharedSecret);
    const encryptedBuffer = await aesKey.encryptBuffer(plainBuffer);

    const publicKeyBuffer = uint8ArrayToBuffer(this.#key.getPublic("array")); // 32 bytes

    // [public key (32 bytes)][encrypted arrayBuffer from AESKey]
    return concatBuffers([publicKeyBuffer, encryptedBuffer]);
  }

  async decryptBuffer(encryptedBuffer: ArrayBuffer): Promise<ArrayBuffer> {
    const encryptedTypedArray = new Uint8Array(encryptedBuffer);
    const rawPublicKey = encryptedTypedArray.subarray(0, 32);
    const publicKey = new PublicKey(rawPublicKey);
    const sharedSecret = await this.#getSharedSecret(publicKey);

    const aesKey = new AESKey("decrypt", sharedSecret);

    return aesKey.decryptBuffer(encryptedTypedArray.subarray(32));
  }
}
