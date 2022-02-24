import LZUTF8 from "lzutf8";
import { ec as EC } from "elliptic";

import {
  concatUint8Arrays,
  getSecureRandomDataOfLength,
  numberToArrayBuffer,
} from "./Helpers";
import EcKey from "./EcKey";
import AesKey from "./AesKey";

export default class PublicKey extends EcKey {
  private theirKeyPair: EC.KeyPair;
  private myKeyPair: EC.KeyPair;

  constructor(keyString: string) {
    super();

    this.myKeyPair = this.ec.genKeyPair();
    this.theirKeyPair = this.ec.keyFromPublic(keyString, "hex");
  }

  async encryptString(rawString: string): Promise<string> {
    const compressedString: Uint8Array = LZUTF8.compress(rawString);
    const encryptedArrayBuffer = await this.encryptArrayBuffer(
      compressedString,
      false
    );
    const encodedString = LZUTF8.encodeBase64(encryptedArrayBuffer);
    const publicKey = this.myKeyPair.getPublic("hex");
    const combinedString = publicKey + "," + encodedString;

    // [public key string][encrypted base64 string]
    return combinedString;
  }

  async encryptArrayBuffer(
    arrayBuffer: ArrayBuffer,
    includeKey = true
  ): Promise<Uint8Array> {
    const sharedSecret = this.myKeyPair
      .derive(this.theirKeyPair.getPublic())
      .toString(16);
    const importSalt = getSecureRandomDataOfLength(16);
    const importSaltLengthBuffer = new Uint8Array(
      numberToArrayBuffer(importSalt.length)
    );

    const aesKey = new AesKey("encrypt", sharedSecret, importSalt);

    const encryptedBuffer = await aesKey.encryptArrayBuffer(arrayBuffer);
    const combinedEncryptedBuffer1 = concatUint8Arrays([
      importSaltLengthBuffer,
      importSalt,
      encryptedBuffer,
    ]); // add import salt length and import salt

    if (includeKey) {
      const publicKey = this.myKeyPair.getPublic("hex");
      const publicKeyBuffer = LZUTF8.encodeUTF8(publicKey);
      const publicKeyBufferLengthBuffer = new Uint8Array(
        numberToArrayBuffer(publicKeyBuffer.length)
      );
      const combinedEncryptedBuffer2 = concatUint8Arrays([
        publicKeyBufferLengthBuffer,
        publicKeyBuffer,
        combinedEncryptedBuffer1,
      ]); // add public key length and public key

      // [public key length(4 bytes)][public key][import salt length(4 bytes)][import salt][encrypted arrayBuffer from AesKey]
      return combinedEncryptedBuffer2;
    }

    // [import salt length(4 bytes)][import salt][encrypted arrayBuffer from AesKey]
    return combinedEncryptedBuffer1;
  }
}
