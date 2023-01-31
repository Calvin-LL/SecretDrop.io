import { concatBuffers, getSecureRandomDataOfLength } from "./helpers";

export class AESKey {
  readonly #keyPurpose: "encrypt" | "decrypt";
  readonly #importedSecret: CryptoKey;

  constructor(keyPurpose: "encrypt" | "decrypt", importedSecret: CryptoKey) {
    this.#keyPurpose = keyPurpose;
    this.#importedSecret = importedSecret;
  }

  private async getKey(importSalt: ArrayBufferLike): Promise<CryptoKey> {
    return window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: importSalt,
        iterations: 3000000,
        hash: "SHA-512",
      },
      this.#importedSecret,
      { name: "AES-GCM", length: 256 },
      false,
      [this.#keyPurpose]
    );
  }

  async encryptBuffer(plainBuffer: ArrayBuffer): Promise<ArrayBuffer> {
    const importSalt = getSecureRandomDataOfLength(16);
    const aesKey = await this.getKey(importSalt);
    const iv = getSecureRandomDataOfLength(12);
    const encryptBuffer = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv, tagLength: 128 },
      aesKey,
      plainBuffer
    );

    // [import salt (16 bytes)][iv (12 bytes)][encrypted string]
    return concatBuffers([importSalt, iv, encryptBuffer]);
  }

  async decryptBuffer(encryptedBuffer: Uint8Array): Promise<ArrayBuffer> {
    const importSalt = encryptedBuffer.subarray(0, 16);
    const aesKey = await this.getKey(importSalt);
    const iv = encryptedBuffer.subarray(16, 28);

    return window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv, tagLength: 128 },
      aesKey,
      encryptedBuffer.subarray(28)
    );
  }
}
