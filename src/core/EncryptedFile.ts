import { saveAs } from "file-saver";

import PrivateKey from "./PrivateKey";

export default class EncryptedFile {
  private file: File;
  private key: PrivateKey;
  private decryptedContent: Uint8Array | undefined;

  constructor(file: File, key: PrivateKey) {
    this.file = file;
    this.key = key;
  }

  async decrypt(): Promise<Uint8Array> {
    const fileArrayBuffer = new Uint8Array(await this.file.arrayBuffer());
    const decryptArrayBuffer = await this.key.decryptArrayBuffer(
      fileArrayBuffer
    );

    this.decryptedContent = decryptArrayBuffer;

    return decryptArrayBuffer;
  }

  download(): void {
    if (this.decryptedContent) {
      saveAs(new Blob([this.decryptedContent]), this.getDecryptedFileName());
    } else {
      throw "file not encrypted";
    }
  }

  getDecryptedFileName(): string {
    if (this.file.name) {
      if (this.file.name.includes("encrypted-")) {
        return this.file.name.replace("encrypted-", "");
      } else {
        return this.file.name;
      }
    } else {
      return "decrypted";
    }
  }
}
