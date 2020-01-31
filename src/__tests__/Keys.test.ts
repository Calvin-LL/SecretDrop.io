import KeyPair from "../common/typescript/KeyPair";
import { KeyPairConfig } from "../common/typescript/KeyPair";
import PrivateKey from "../common/typescript/PrivateKey";
import PublicKey from "../common/typescript/PublicKey";
import WebCrypto from "node-webcrypto-ossl";

// @ts-ignore
window.crypto = new WebCrypto();

describe("Export and import public key", () => {
  test("with default hash", async () => {
    await testPublicKeyWithHash();
  }, 120000);

  test("with hash SHA-256", async () => {
    await testPublicKeyWithHash({ hash: "SHA-256" });
  }, 120000);

  test("with hash SHA-384", async () => {
    await testPublicKeyWithHash({ hash: "SHA-384" });
  }, 120000);

  test("with hash SHA-512", async () => {
    await testPublicKeyWithHash({ hash: "SHA-512" });
  }, 120000);

  async function testPublicKeyWithHash(config?: KeyPairConfig) {
    const keyPair = new KeyPair(config);
    await keyPair.init();

    const publicKey = await keyPair.getPublicKey();
    const publicKeyString = await publicKey.getKeyString();

    expect(typeof publicKeyString).toBe("string");
    expect(publicKeyString.length).toBeGreaterThan(10);

    const publicKey2 = new PublicKey(publicKeyString);
    await publicKey2.init();
    const publicKey2String = await publicKey2.getKeyString();

    expect(publicKeyString).toBe(publicKey2String);
  }
});

describe("Export private key", () => {
  test("with default hash", async () => {
    await testPrivateKeyWithHash();
  }, 120000);

  test("with hash SHA-256", async () => {
    await testPrivateKeyWithHash({ hash: "SHA-256" });
  }, 120000);

  test("with hash SHA-384", async () => {
    await testPrivateKeyWithHash({ hash: "SHA-384" });
  }, 120000);

  test("with hash SHA-512", async () => {
    await testPrivateKeyWithHash({ hash: "SHA-512" });
  }, 120000);

  async function testPrivateKeyWithHash(config?: KeyPairConfig) {
    const keyPair = new KeyPair(config);
    await keyPair.init();

    const privateKey = await keyPair.getPrivateKey();
    const privateKeyString = await privateKey.getKeyString();

    expect(typeof privateKeyString).toBe("string");
    expect(privateKeyString.length).toBeGreaterThan(10);

    const privateKey2 = new PrivateKey(privateKeyString);
    await privateKey2.init();
    const privateKey2String = await privateKey2.getKeyString();

    expect(privateKeyString).toBe(privateKey2String);
  }
});
