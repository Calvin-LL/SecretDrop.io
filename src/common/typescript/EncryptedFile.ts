import "blob-polyfill";

import LZUTF8 from "lzutf8";
import PrivateKey from "./PrivateKey";
import { saveAs } from "file-saver";

export default class EncryptedFile {
  private file: File;
  private type: string | undefined;
  private decryptedContent: Uint8Array | undefined;
  private unwrappingKey: PrivateKey;

  constructor(file: File, unwrappingKey: PrivateKey) {
    this.file = file;
    this.unwrappingKey = unwrappingKey;
  }

  decrypt() {
    // @ts-ignore
    const fileArrayBuffer: Promise<ArrayBuffer> = this.file.arrayBuffer();

    return fileArrayBuffer.then(fileArrayBuffer => {
      const fileUint8Array = new Uint8Array(fileArrayBuffer);
      const typeLength = EncryptedFile.arrayBufferToNumber(fileUint8Array.subarray(0, 4));
      if (typeLength) {
        this.type = LZUTF8.decodeUTF8(fileUint8Array.subarray(4, typeLength + 4));
      }
      const keyStart = 4 + typeLength;
      const keyLength = EncryptedFile.arrayBufferToNumber(fileUint8Array.subarray(keyStart, keyStart + 4));
      const wrappedKey = fileUint8Array.subarray(keyStart + 4, keyStart + 4 + keyLength);
      const file = fileUint8Array.subarray(keyStart + 4 + keyLength, keyStart + fileUint8Array.length);

      return this.unwrappingKey.unwrapUint8ArrayKey(wrappedKey).then(aesKey => aesKey.decryptArrayBuffer(file));
    });
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

  static arrayBufferToNumber(arr: ArrayBuffer) {
    const view = new DataView(arr);
    return view.getUint32(0, false);
  }
}
