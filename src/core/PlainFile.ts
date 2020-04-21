import PublicKey from "./PublicKey";
import { fileToArrayBuffer } from "./Helpers";
import { saveAs } from "file-saver";

export default class PlainFile {
  private file: File;
  private key: PublicKey;
  private encryptedContent: Uint8Array | undefined;

  constructor(file: File, key: PublicKey) {
    this.file = file;
    this.key = key;
  }

  async encrypt() {
    const fileArrayBuffer = await fileToArrayBuffer(this.file);
    const encryptArrayBuffer = await this.key.encryptArrayBuffer(
      fileArrayBuffer
    );

    this.encryptedContent = encryptArrayBuffer;

    return encryptArrayBuffer;
  }

  download() {
    if (this.encryptedContent)
      saveAs(
        new Blob([this.encryptedContent]),
        this.getSafeEncryptedFileName()
      );
    else throw "file not encrypted";
  }

  getSafeEncryptedFileName() {
    if (this.file.name) return "encrypted-" + this.file.name;
    else return "encrypted";
  }
}
