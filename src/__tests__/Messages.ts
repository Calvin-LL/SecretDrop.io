import EncryptedMessage from "../common/typescript/EncryptedMessage";
import KeyPair from "../common/typescript/KeyPair";
import { KeyPairConfig } from "../common/typescript/KeyPair";
import PlainMessage from "../common/typescript/PlainMessage";
import WebCrypto from "node-webcrypto-ossl";
// @ts-ignore
import blns from "./blns.json";

// @ts-ignore
window.crypto = new WebCrypto();

describe("PlainMessage to and from EncryptedMessage", () => {
  test("valid strings from big-list-of-naughty-strings with default hash", async () => {
    await encryptThenDecryptWithKey();
  }, 120000);

  test("valid strings from big-list-of-naughty-strings with SHA-256", async () => {
    await encryptThenDecryptWithKey({ hash: "SHA-256" });
  }, 120000);

  test("valid strings from big-list-of-naughty-strings with SHA-384", async () => {
    await encryptThenDecryptWithKey({ hash: "SHA-384" });
  }, 120000);

  test("valid strings from big-list-of-naughty-strings with SHA-512", async () => {
    await encryptThenDecryptWithKey({ hash: "SHA-512" });
  }, 120000);

  test("invalid strings from big-list-of-naughty-strings", async () => {
    for (const message of blns as string[]) {
      const keyPair = new KeyPair();
      await keyPair.init();

      const publicKey = await keyPair.getPublicKey();

      if (publicKey.isStringEncryptable(message)) continue;

      const encryptFunction = async () => {
        const plainMessage = new PlainMessage(message, publicKey);
        await plainMessage.encrypt(); // should throw
      };

      await expect(encryptFunction()).rejects.toThrow();
    }
  }, 120000);
});

async function encryptThenDecryptWithKey(config?: KeyPairConfig) {
  for (const message of blns as string[]) {
    const keyPair = new KeyPair(config);
    await keyPair.init();

    const privateKey = await keyPair.getPrivateKey();
    const publicKey = await keyPair.getPublicKey();

    if (!publicKey.isStringEncryptable(message)) continue;

    const plainMessage = new PlainMessage(message, publicKey);
    const encryptedPlainMessage = await plainMessage.encrypt();

    const encryptedMessage = new EncryptedMessage(encryptedPlainMessage, privateKey);
    const decryptedEncryptedPlainMessage = await encryptedMessage.decrypt();

    expect(decryptedEncryptedPlainMessage).toBe(message);
  }
}
