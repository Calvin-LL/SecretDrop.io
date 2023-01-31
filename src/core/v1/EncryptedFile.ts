import { bufferToUint8 } from "./helpers";
import { V1_VERSION_CODE } from "./constants";
import { PrivateKey } from "./PrivateKey";
import { PlainFile } from "./PlainFile";
import { DownloadableFile } from "./DownloadableFile";

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
