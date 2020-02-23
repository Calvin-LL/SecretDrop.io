import AesKey from "./AesKey";
import { ec as EC } from "elliptic";
import EcKey from "./EcKey";
import LZUTF8 from "lzutf8";
import { arrayBufferToNumber } from "./Helpers";

export default class PrivateKey extends EcKey {
  private myKeyPair: EC.KeyPair;

  constructor(keyString: string) {
    super();

    this.myKeyPair = this.ec.keyFromPrivate(keyString);
  }

  async decryptString(encodedString: string) {
    const lastIndexOfComma = encodedString.lastIndexOf(",");
    const theirPublicKeyString = encodedString.substring(0, lastIndexOfComma);
    const encryptedMessage = encodedString.substring(lastIndexOfComma + 1);
    const theirKeyPair = this.ec.keyFromPublic(theirPublicKeyString, "hex");
    const decodedString = LZUTF8.decodeBase64(encryptedMessage);
    const decryptedArrayBuffer = await this.decryptArrayBuffer(decodedString, theirKeyPair);
    const decompressedString = LZUTF8.decompress(decryptedArrayBuffer);

    return decompressedString;
  }

  async decryptArrayBuffer(encryptedArrayBuffer: ArrayBuffer, theirKeyPairGiven?: EC.KeyPair) {
    const aesKey = new AesKey(false);
    const combinedEncryptedBuffer4 = new Uint8Array(encryptedArrayBuffer);

    if (theirKeyPairGiven) {
      const theirKeyPair = theirKeyPairGiven;
      const sharedSecret = this.myKeyPair.derive(theirKeyPair.getPublic()).toString(16);
      const importSaltLength = arrayBufferToNumber(combinedEncryptedBuffer4.slice(0, 4).buffer);
      const importSalt = combinedEncryptedBuffer4.subarray(4, 4 + importSaltLength);
      const encryptedBuffer = combinedEncryptedBuffer4.subarray(4 + importSaltLength);

      await aesKey.init(sharedSecret, importSalt);

      const decryptedBuffer = await aesKey.decryptArrayBuffer(encryptedBuffer);

      return decryptedBuffer;
    }

    const publicKeyBufferLength = arrayBufferToNumber(combinedEncryptedBuffer4.slice(0, 4).buffer);
    const publicKeyBuffer = combinedEncryptedBuffer4.subarray(4, 4 + publicKeyBufferLength);
    const publicKeyString = LZUTF8.decodeUTF8(publicKeyBuffer);
    const theirKeyPair = this.ec.keyFromPublic(publicKeyString, "hex");
    const sharedSecret = this.myKeyPair.derive(theirKeyPair.getPublic()).toString(16);
    const importSaltLength = arrayBufferToNumber(
      combinedEncryptedBuffer4.slice(4 + publicKeyBufferLength, 8 + publicKeyBufferLength).buffer
    );
    const importSalt = combinedEncryptedBuffer4.subarray(
      8 + publicKeyBufferLength,
      8 + publicKeyBufferLength + importSaltLength
    );
    const encryptedBuffer = combinedEncryptedBuffer4.subarray(8 + publicKeyBufferLength + importSaltLength);

    await aesKey.init(sharedSecret, importSalt);

    const decryptedBuffer = await aesKey.decryptArrayBuffer(encryptedBuffer);

    return decryptedBuffer;
  }
}
