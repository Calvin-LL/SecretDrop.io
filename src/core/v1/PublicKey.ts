import { type curve, type ec } from "elliptic";
// @ts-expect-error the ts doesn't have that file
import KeyPair from "elliptic/lib/elliptic/ec/key";

import { base64ToBuffer, bufferToBase64 } from "./base64";
import { V1_VERSION_CODE, V1_VERSION_CODE_BUFFER } from "./constants";
import { ecurve } from "./ecurve";
import { bufferToUint8, concatBuffers, uint8ArrayToBuffer } from "./helpers";

export class PublicKey {
  readonly #key: ec.KeyPair;

  constructor(key: Uint8Array | string | ec.KeyPair) {
    if (typeof key === "string") {
      const versionKeyBuffer = base64ToBuffer(key);
      const versionCode = bufferToUint8(versionKeyBuffer);
      if (versionCode !== V1_VERSION_CODE) {
        throw new Error("Invalid version code in key");
      }
      const keyBuffer = new Uint8Array(versionKeyBuffer, 1);

      this.#key = ecurve.keyFromPublic(keyBuffer);
    } else if (key instanceof KeyPair) {
      this.#key = key as ec.KeyPair;
    } else if (key instanceof Uint8Array) {
      this.#key = ecurve.keyFromPublic(key);
    } else {
      throw new Error("Invalid key type");
    }
  }

  toString(): string {
    const publicKeyBuffer = uint8ArrayToBuffer(this.#key.getPublic("array"));

    return bufferToBase64(
      concatBuffers([V1_VERSION_CODE_BUFFER, publicKeyBuffer])
    );
  }

  getPublicBasePoint(): curve.base.BasePoint {
    return this.#key.getPublic();
  }
}
