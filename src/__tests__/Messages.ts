import EncryptedMessage from "../common/typescript/EncryptedMessage";
import KeyPair from "../common/typescript/KeyPair";
import PlainMessage from "../common/typescript/PlainMessage";
import WebCrypto from "node-webcrypto-ossl";
import blns from "./blns.json";

describe("PlainMessage to and from EncryptedMessage", () => {
  // @ts-ignore
  window.crypto = new WebCrypto();

  test("valid strings from big-list-of-naughty-strings", async () => {
    for (const message of blns as string[]) {
      const keyPair = new KeyPair();
      await keyPair.init();

      const privateKey = await keyPair.getPrivateKey();
      const publicKey = await keyPair.getPublicKey();

      const plainMessage = new PlainMessage(message, publicKey);
      const encryptedPlainMessage = await plainMessage.encrypt();

      const encryptedMessage = new EncryptedMessage(encryptedPlainMessage, privateKey);
      const decryptedEncryptedPlainMessage = await encryptedMessage.decrypt();

      expect(decryptedEncryptedPlainMessage).toBe(message);
    }
  }, 120000);
});
