import {
  concatUint8Arrays,
  getRandomDataOfLength,
  numberToArrayBuffer,
} from "./Helpers";

import AesKey from "./AesKey";
import { ec as EC } from "elliptic";
import EcKey from "./EcKey";
import LZUTF8 from "lzutf8";

export default class PublicKey extends EcKey {
  private theirKeyPair: EC.KeyPair;
  private myKeyPair: EC.KeyPair;

  constructor(keyString: string) {
    super();

    this.myKeyPair = this.ec.genKeyPair();
    this.theirKeyPair = this.ec.keyFromPublic(keyString, "hex");
  }

  async encryptString(rawString: string) {
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
    includeKey: boolean = true
  ) {
    const aesKey = new AesKey(true);
    const sharedSecret = this.myKeyPair
      .derive(this.theirKeyPair.getPublic())
      .toString(16);
    const importSalt = getRandomDataOfLength(16);
    const importSaltLengthBuffer = new Uint8Array(
      numberToArrayBuffer(importSalt.length)
    );

    await aesKey.init(sharedSecret, importSalt);

    const encryptedBuffer = await aesKey.encryptArrayBuffer(arrayBuffer);
    const combinedEncryptedBuffer1 = concatUint8Arrays(
      importSalt,
      encryptedBuffer
    ); // add import salt
    const combinedEncryptedBuffer2 = concatUint8Arrays(
      importSaltLengthBuffer,
      combinedEncryptedBuffer1
    ); // add import salt length

    if (includeKey) {
      const publicKey = this.myKeyPair.getPublic("hex");
      const publicKeyBuffer = LZUTF8.encodeUTF8(publicKey);
      const publicKeyBufferLengthBuffer = new Uint8Array(
        numberToArrayBuffer(publicKeyBuffer.length)
      );
      const combinedEncryptedBuffer3 = concatUint8Arrays(
        publicKeyBuffer,
        combinedEncryptedBuffer2
      ); // add public key
      const combinedEncryptedBuffer4 = concatUint8Arrays(
        publicKeyBufferLengthBuffer,
        combinedEncryptedBuffer3
      ); // add public key length

      // [public key length(4 bytes)][public key][import salt length(4 bytes)][import salt][encrypted arrayBuffer from AesKey]
      return combinedEncryptedBuffer4;
    }

    // [import salt length(4 bytes)][import salt][encrypted arrayBuffer from AesKey]
    return combinedEncryptedBuffer2;
  }
}
