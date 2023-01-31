import LZUTF8 from "lzutf8";

import { V1_VERSION_CODE_STRING } from "./constants";
import { base64ToBuffer } from "./base64";
import { PrivateKey } from "./PrivateKey";
import { PlainText } from "./PlainText";
import { DownloadableText } from "./DownloadableText";

export class EncryptedText extends DownloadableText {
  constructor(content: string) {
    super(content, "encrypted.txt");

    const versionNumberString = content.substring(0, content.indexOf("."));
    if (versionNumberString !== V1_VERSION_CODE_STRING) {
      throw new Error("Invalid version code in text");
    }
  }

  async decrypt(privateKey: PrivateKey): Promise<PlainText> {
    const encryptedString = this.content.substring(
      this.content.indexOf(".") + 1
    );
    const encryptedBuffer = base64ToBuffer(encryptedString);
    const decryptedBuffer = await privateKey.decryptBuffer(encryptedBuffer);
    const decryptedString = LZUTF8.decompress(new Uint8Array(decryptedBuffer));

    return new PlainText(decryptedString);
  }

  toString(): string {
    return this.content;
  }
}
