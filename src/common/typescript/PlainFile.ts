import "blob-polyfill";

import AesKey from "./AesKey";
import LZUTF8 from "lzutf8";
import PublicKey from "./PublicKey";
import { saveAs } from "file-saver";

export default class PlainFile {
  private file: File;
  private encryptedContent: Uint8Array | undefined;
  private wrappingKey: PublicKey;

  constructor(file: File, wrappingKey: PublicKey) {
    this.file = file;
    this.wrappingKey = wrappingKey;
  }

  encrypt() {
    // @ts-ignore
    const fileArrayBuffer: Promise<ArrayBuffer> = this.file.arrayBuffer();
    const aesKey: AesKey = new AesKey();

    return Promise.all([fileArrayBuffer, aesKey.init()])
      .then(([fileArrayBuffer, _]) =>
        Promise.all([
          this.wrappingKey.wrapKeyAsUint8Array(aesKey),
          aesKey.encryptArrayBuffer(fileArrayBuffer as ArrayBuffer),
        ])
      )
      .then(([wrappedKey, encryptedFile]) => {
        const wkLengthArrayBuffer = new Uint8Array(PlainFile.numberToArrayBuffer(wrappedKey.length));

        return AesKey.concatUint8Arrays(wkLengthArrayBuffer, AesKey.concatUint8Arrays(wrappedKey, encryptedFile));
      })
      .then(encryptedFileBuffer => {
        // add file type
        let type = new Uint8Array();
        if (this.file.type) type = LZUTF8.encodeUTF8(this.file.type);

        const typeLengthArrayBuffer = new Uint8Array(PlainFile.numberToArrayBuffer(type.length));
        const result = AesKey.concatUint8Arrays(
          typeLengthArrayBuffer,
          AesKey.concatUint8Arrays(type, encryptedFileBuffer)
        );

        this.encryptedContent = result;
        return result;
      });
    // [length of type string(4 bytes)][type string][length of RSA wrapped AES key(4 bytes)][RSA wrapped AES key][iv][encrypted file]
  }

  download() {
    if (this.encryptedContent) saveAs(new Blob([this.encryptedContent]), this.getSafeEncryptedFileName());
    else throw "file not encrypted";
  }

  getSafeEncryptedFileName() {
    if (this.file.name) return "encrypted-" + this.file.name;
    else return "encrypted";
  }

  static numberToArrayBuffer(num: number) {
    const arr = new ArrayBuffer(4);
    const view = new DataView(arr);
    view.setUint32(0, num, false);
    return arr;
  }
}
