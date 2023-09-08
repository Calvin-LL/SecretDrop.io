// calculate the mapping of the length between the plain text and the cipher text

import crypto from "node:crypto";
import fs from "node:fs";
import { KeyPair } from "../src/core/v1/KeyPair";
import { PlainText } from "../src/core/v1/PlainText";

globalThis.window = {
  // @ts-expect-error @types/node's webcrypto definition is not exactly the same as window.crypto
  crypto: crypto.webcrypto,
};

const outputFile = "./averageSizes.csv";

(async () => {
  const averageSizes: [
    plainTextLength: number,
    averageCipherTextLength: number,
  ][] = [];

  for (let i = 200; i <= 1000; i += 100) {
    console.log(`Calculating length ${i}...`);

    const plainTextLength = i;
    const cipherTextLengths: number[] = [];

    for (let j = 0; j < 20; j++) {
      console.log(`    ${j}`);
      const message = generateRandomString(plainTextLength);

      const aKeyPair = new KeyPair();
      const bKeyPair = new KeyPair();

      const plainText = new PlainText(message);
      const encryptText = await plainText.encrypt(
        aKeyPair.privateKey,
        bKeyPair.publicKey
      );

      cipherTextLengths.push(encryptText.content.length);
    }

    const averageCipherTextLength =
      cipherTextLengths.reduce((a, b) => a + b, 0) / cipherTextLengths.length;
    averageSizes.push([plainTextLength, averageCipherTextLength]);

    fs.appendFileSync(
      outputFile,
      `${plainTextLength},${averageCipherTextLength}\n`
    );
  }

  // const output = averageSizes
  // .map(([plainTextLength, averageCipherTextLength]) => {
  //   return `${plainTextLength},${averageCipherTextLength}`;
  // })
  // .join("\n");
})();

function generateRandomString(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let result = "";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(crypto.randomInt(0, characters.length));
  }

  return result;
}
