import { saveAs } from "file-saver";

import PublicKey from "./PublicKey";

export default class PlainFile {
  private file: File;
  private key: PublicKey;
  private encryptedContent: Uint8Array | undefined;

  constructor(file: File, key: PublicKey) {
    this.file = file;
    this.key = key;
  }

  async encrypt(): Promise<Uint8Array> {
    const fileArrayBuffer = await this.file.arrayBuffer();
    const encryptArrayBuffer = await this.key.encryptArrayBuffer(
      fileArrayBuffer
    );

    this.encryptedContent = encryptArrayBuffer;

    return encryptArrayBuffer;
  }

  download(): void {
    if (this.encryptedContent) {
      saveAs(
        new Blob([this.encryptedContent]),
        this.getSafeEncryptedFileName()
      );
    } else {
      throw "file not encrypted";
    }
  }

  getSafeEncryptedFileName(): string {
    if (this.file.name) {
      return "encrypted-" + this.file.name;
    } else {
      return "encrypted";
    }
  }
}
