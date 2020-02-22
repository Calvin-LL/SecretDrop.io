import AesKey from "../common/typescript/AesKey";
import { AesKeyConfig } from "../common/typescript/AesKey";
import WebCrypto from "node-webcrypto-ossl";
// @ts-ignore
import blns from "./blns.json";

// @ts-ignore
window.crypto = new WebCrypto();

describe("Encrypt and Decrypt with aes with different lengths", () => {
  test("with default length", async () => {
    await testAesKeyWithLength();
  }, 120000);

  test("with 128", async () => {
    await testAesKeyWithLength({ length: 128 });
  }, 120000);

  test("with 192", async () => {
    await testAesKeyWithLength({ length: 192 });
  }, 120000);

  test("with 256", async () => {
    await testAesKeyWithLength({ length: 256 });
  }, 120000);

  async function testAesKeyWithLength(config?: AesKeyConfig) {
    for (const message of blns as string[]) {
      const aesKey = new AesKey(config);
      await aesKey.init();

      const encryptedString = await aesKey.encryptString(message);

      expect(typeof encryptedString).toBe("string");
    }
  }
});
