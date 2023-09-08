import { DownloadableFile } from "./DownloadableFile";
import { PlainFile } from "./PlainFile";
import { PrivateKey } from "./PrivateKey";
import { V1_VERSION_CODE } from "./constants";
import { bufferToUint8 } from "./helpers";

export class EncryptedFile extends DownloadableFile {
  constructor(buffer: ArrayBuffer, name: string) {
    super(buffer, name);

    const versionCode = bufferToUint8(buffer);
    if (versionCode !== V1_VERSION_CODE) {
      throw new Error("Invalid version code in file");
    }
  }

  async decrypt(privateKey: PrivateKey): Promise<PlainFile> {
    const encryptedBuffer = new Uint8Array(this.buffer, 1);
    const decryptedFileBuffer = await privateKey.decryptBuffer(encryptedBuffer);
    const decryptedFileName = EncryptedFile.getDecryptedFileName(this.name);

    return new PlainFile(decryptedFileBuffer, decryptedFileName);
  }

  static getDecryptedFileName(name: string): string {
    if (name) {
      if (name.includes("encrypted-")) {
        return name.replace("encrypted-", "");
      } else {
        return name;
      }
    } else {
      return "decrypted";
    }
  }
}
