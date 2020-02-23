import { arrayBufferToNumber, fileToArrayBuffer } from "./Helpers";

import LZUTF8 from "lzutf8";
import PrivateKey from "./PrivateKey";
import { saveAs } from "file-saver";

export default class EncryptedFile {
  private file: File;
  private key: PrivateKey;
  private type: string | undefined;
  private decryptedContent: Uint8Array | undefined;

  constructor(file: File, key: PrivateKey) {
    this.file = file;
    this.key = key;
  }

  async decrypt() {
    // @ts-ignore
    const fileArrayBuffer = new Uint8Array(await fileToArrayBuffer(this.file));

    const typeLength = arrayBufferToNumber(fileArrayBuffer.slice(0, 4).buffer);
    const typeBuffer = fileArrayBuffer.subarray(4, 4 + typeLength);

    if (typeBuffer.length > 0) {
      this.type = LZUTF8.decodeUTF8(typeBuffer);
    }

    const contentBuffer = fileArrayBuffer.subarray(4 + typeLength);
    const decryptArrayBuffer = await this.key.decryptArrayBuffer(contentBuffer);

    this.decryptedContent = decryptArrayBuffer;

    return decryptArrayBuffer;
  }

  download() {
    if (this.decryptedContent)
      if (this.type) saveAs(new Blob([this.decryptedContent], { type: this.type }), this.getSafeEncryptedFileName());
      else saveAs(new Blob([this.decryptedContent]), this.getSafeEncryptedFileName());
    else throw "file not encrypted";
  }

  getSafeEncryptedFileName() {
    if (this.file.name)
      if (this.file.name.includes("encrypted-")) return this.file.name.replace("encrypted-", "");
      else return this.file.name;
    else return "decrypted";
  }
}
