import { saveAs } from "file-saver";

import { fileToArrayBuffer } from "./Helpers";
import PrivateKey from "./PrivateKey";

export default class EncryptedFile {
  private file: File;
  private key: PrivateKey;
  private decryptedContent: Uint8Array | undefined;

  constructor(file: File, key: PrivateKey) {
    this.file = file;
    this.key = key;
  }

  async decrypt() {
    // @ts-ignore
    const fileArrayBuffer = new Uint8Array(await fileToArrayBuffer(this.file));
    const decryptArrayBuffer = await this.key.decryptArrayBuffer(
      fileArrayBuffer
    );

    this.decryptedContent = decryptArrayBuffer;

    return decryptArrayBuffer;
  }

  download() {
    if (this.decryptedContent)
      saveAs(
        new Blob([this.decryptedContent]),
        this.getSafeEncryptedFileName()
      );
    else throw "file not encrypted";
  }

  getSafeEncryptedFileName() {
    if (this.file.name)
      if (this.file.name.includes("encrypted-"))
        return this.file.name.replace("encrypted-", "");
      else return this.file.name;
    else return "decrypted";
  }
}
