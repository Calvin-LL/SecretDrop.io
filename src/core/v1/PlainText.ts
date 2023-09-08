import LZUTF8 from "lzutf8";

import { DownloadableText } from "./DownloadableText";
import { EncryptedText } from "./EncryptedText";
import { PrivateKey } from "./PrivateKey";
import { PublicKey } from "./PublicKey";
import { bufferToBase64 } from "./base64";
import { V1_VERSION_CODE_STRING } from "./constants";

export class PlainText extends DownloadableText {
  constructor(content: string) {
    super(content, "decrypted.txt");
  }

  async encrypt(
    privateKey: PrivateKey,
    publicKey: PublicKey
  ): Promise<EncryptedText> {
    const compressedStringBuffer = LZUTF8.compress(this.content);
    const encryptedBuffer = await privateKey.encryptBuffer(
      publicKey,
      compressedStringBuffer
    );
    const encryptedString = bufferToBase64(encryptedBuffer);
    const encryptedWithVersion = V1_VERSION_CODE_STRING + "." + encryptedString;

    return new EncryptedText(encryptedWithVersion);
  }

  toString(): string {
    return this.content;
  }
}
