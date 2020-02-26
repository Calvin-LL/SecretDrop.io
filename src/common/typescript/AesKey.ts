import "webcrypto-shim";

import { concatUint8Arrays, getRandomDataOfLength } from "./Helpers";

import LZUTF8 from "lzutf8";

export interface AesKeyConfig extends Partial<Omit<AesKeyGenParams, "name">> {}

export default class AesKey {
  private config: Omit<AesKeyGenParams, "name"> = {
    length: 256,
  };
  private encryptOnly: boolean;

  private cryptoKey: CryptoKey | undefined;

  constructor(encryptOnly: boolean, config?: AesKeyConfig) {
    this.encryptOnly = encryptOnly;
    this.config = { ...this.config, ...config };
  }

  async init(secret: string, importSalt: Uint8Array) {
    const secretBuffer = LZUTF8.encodeUTF8(secret);
    // @ts-ignore
    const importedSecret = await window.crypto.subtle.importKey("raw", secretBuffer, { name: "PBKDF2" }, false, [
      "deriveKey",
    ]);

    this.cryptoKey = await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: importSalt,
        iterations: 3000000,
        hash: "SHA-256",
      },
      importedSecret,
      { name: "AES-GCM", length: 256, ...this.config },
      false,
      this.encryptOnly ? ["encrypt"] : ["decrypt"]
    );
  }

  async encryptArrayBuffer(arrayBuffer: ArrayBuffer) {
    if (this.cryptoKey) {
      const iv = getRandomDataOfLength(12);
      const encryptStringBuffer = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        this.cryptoKey,
        new Uint8Array(arrayBuffer)
      );
      const combinedOutput = concatUint8Arrays(iv, new Uint8Array(encryptStringBuffer)); // add iv in front

      // combinedOutput is of the format [iv(12 bytes)][encrypted string]
      return combinedOutput;
    } else throw "init must be call before encryptArrayBuffer";
  }

  async decryptArrayBuffer(arrayBuffer: ArrayBuffer) {
    if (this.cryptoKey) {
      const encryptedUint8Array = new Uint8Array(arrayBuffer);
      const iv = encryptedUint8Array.subarray(0, 12);
      const encodeString = encryptedUint8Array.subarray(12, encryptedUint8Array.length);
      const decryptStringBuffer = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        this.cryptoKey,
        encodeString
      );

      return new Uint8Array(decryptStringBuffer);
    } else throw "init must be call before decryptArrayBuffer";
  }
}
