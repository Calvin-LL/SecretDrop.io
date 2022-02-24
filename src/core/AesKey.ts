import LZUTF8 from "lzutf8";

import { concatUint8Arrays, getSecureRandomDataOfLength } from "./Helpers";

export type AesKeyConfig = Partial<Omit<AesKeyGenParams, "name">>;

export default class AesKey {
  private config: Omit<AesKeyGenParams, "name"> = {
    length: 256,
  };
  private keyPurpose: "encrypt" | "decrypt";
  private cryptoKeyPromise: Promise<CryptoKey>;

  constructor(
    keyPurpose: "encrypt" | "decrypt",
    secret: string,
    importSalt: Uint8Array,
    config?: AesKeyConfig
  ) {
    this.keyPurpose = keyPurpose;
    this.config = { ...this.config, ...config };
    this.cryptoKeyPromise = this.initializeKey(secret, importSalt);
  }

  private async initializeKey(
    secret: string,
    importSalt: Uint8Array
  ): Promise<CryptoKey> {
    const secretBuffer = LZUTF8.encodeUTF8(secret);
    const importedSecret = await window.crypto.subtle.importKey(
      "raw",
      secretBuffer,
      "PBKDF2",
      false,
      ["deriveKey"]
    );
    const cryptoKey = await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: importSalt,
        iterations: 3000000,
        hash: "SHA-256",
      },
      importedSecret,
      { name: "AES-GCM", ...this.config },
      false,
      [this.keyPurpose]
    );

    return cryptoKey;
  }

  async encryptArrayBuffer(arrayBuffer: ArrayBuffer): Promise<Uint8Array> {
    const cryptoKey = await this.cryptoKeyPromise;
    const iv = getSecureRandomDataOfLength(12);
    const encryptStringBuffer = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv, tagLength: 128 },
      cryptoKey,
      new Uint8Array(arrayBuffer)
    );
    const combinedOutput = concatUint8Arrays([
      iv,
      new Uint8Array(encryptStringBuffer),
    ]); // add iv in front

    // combinedOutput is of the format [iv(12 bytes)][encrypted string]
    return combinedOutput;
  }

  async decryptArrayBuffer(arrayBuffer: ArrayBuffer): Promise<Uint8Array> {
    const cryptoKey = await this.cryptoKeyPromise;
    const encryptedUint8Array = new Uint8Array(arrayBuffer);
    const iv = encryptedUint8Array.subarray(0, 12);
    const encodeString = encryptedUint8Array.subarray(
      12,
      encryptedUint8Array.length
    );
    const decryptStringBuffer = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv, tagLength: 128 },
      cryptoKey,
      encodeString
    );

    return new Uint8Array(decryptStringBuffer);
  }
}
