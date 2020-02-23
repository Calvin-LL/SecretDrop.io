import { concatUint8Arrays, fileToArrayBuffer, numberToArrayBuffer } from "./Helpers";

import LZUTF8 from "lzutf8";
import PublicKey from "./PublicKey";
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
    const encryptArrayBuffer = await this.key.encryptArrayBuffer(fileArrayBuffer);

    let type = new Uint8Array();
    if (this.file.type) type = LZUTF8.encodeUTF8(this.file.type);

    const typeLengthArrayBuffer = new Uint8Array(numberToArrayBuffer(type.length));
    const combinedEncryptArrayBuffer1 = concatUint8Arrays(type, encryptArrayBuffer); // add type
    const combinedEncryptArrayBuffer2 = concatUint8Arrays(typeLengthArrayBuffer, combinedEncryptArrayBuffer1); // add type length

    this.encryptedContent = combinedEncryptArrayBuffer2;

    return combinedEncryptArrayBuffer2;
  }

  download() {
    if (this.encryptedContent) saveAs(new Blob([this.encryptedContent]), this.getSafeEncryptedFileName());
    else throw "file not encrypted";
  }

  getSafeEncryptedFileName() {
    if (this.file.name) return "encrypted-" + this.file.name;
    else return "encrypted";
  }
}
