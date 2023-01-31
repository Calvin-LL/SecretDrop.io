import { concatBuffers } from "./helpers";
import { V1_VERSION_CODE_BUFFER } from "./constants";
import { PublicKey } from "./PublicKey";
import { PrivateKey } from "./PrivateKey";
import { EncryptedFile } from "./EncryptedFile";
import { DownloadableFile } from "./DownloadableFile";

export class PlainFile extends DownloadableFile {
  constructor(buffer: ArrayBuffer, name: string) {
    super(buffer, name);
  }

  async encrypt(
    privateKey: PrivateKey,
    publicKey: PublicKey
  ): Promise<EncryptedFile> {
    const encryptedBuffer = await privateKey.encryptBuffer(
      publicKey,
      this.buffer
    );
    const encryptedBufferWithVersion = concatBuffers([
      V1_VERSION_CODE_BUFFER,
      encryptedBuffer,
    ]);
    const encryptedFileName = PlainFile.getEncryptedFileName(this.name);

    return new EncryptedFile(encryptedBufferWithVersion, encryptedFileName);
  }

  static getEncryptedFileName(name: string): string {
    if (name) {
      return `encrypted-${name}`;
    } else {
      return "encrypted";
    }
  }
}
