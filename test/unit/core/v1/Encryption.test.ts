import { webcrypto } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { expect, it } from "vitest";

import { File } from "../v1/File";

import { EncryptedFile } from "@/core/v1/EncryptedFile";
import { EncryptedText } from "@/core/v1/EncryptedText";
import { KeyPair } from "@/core/v1/KeyPair";
import { PlainFile } from "@/core/v1/PlainFile";
import { PlainText } from "@/core/v1/PlainText";
import { PrivateKey } from "@/core/v1/PrivateKey";
import { PublicKey } from "@/core/v1/PublicKey";

// eslint-disable-next-line no-global-assign
globalThis.window = {
  // @ts-expect-error @types/node's webcrypto definition is not exactly the same as window.crypto
  crypto: webcrypto,
};
// @ts-expect-error our FileImpl is not compatible with the dom's File
globalThis.File = File;

it("should encrypt then decrypt string", async () => {
  const ogMessage =
    "!#$%&()*MNOPQRSTUVWXYZ[]^_`abcdefghijklmnz{|}~☇☈☉☊☋☌☍☎☏☐☑☒☓☚☛☜☝☞☟☠☡☢☣☤☥买乱乲乳乴乵乶乷乸乹乺乻乼乽癩羅蘿螺裸邏樂洛烙珞落酪駱亂👩🏼‍🦯👩‍❤️‍👨👩‍❤️‍👩👨‍❤️‍👨👩‍❤️‍💋‍👨👩‍❤️‍💋‍👩👨‍👩‍👦👨‍❤️‍💋‍👨👨‍👩‍👧👩‍👩‍👧‍👧👩‍👦👗👮🏿‍♀️👮🏿👮🏽‍♂️";
  const message = ogMessage;

  // a is sending encrypted text to b
  const aKeyPair = new KeyPair();
  const bKeyPair = new KeyPair();

  const plainText = new PlainText(message);
  const encryptText = await plainText.encrypt(
    aKeyPair.privateKey,
    bKeyPair.publicKey
  );
  const encryptedMessage = new EncryptedText(encryptText.content);

  const decryptText = await encryptedMessage.decrypt(bKeyPair.privateKey);

  expect(plainText.name).toMatchInlineSnapshot('"decrypted.txt"');
  expect(encryptText.name).toMatchInlineSnapshot('"encrypted.txt"');

  expect(decryptText.content).toBe(message);
}, 60000);

it("should encrypt then decrypt string and reconstruct keys from strings", async () => {
  const ogMessage =
    "!#$%&()*MNOPQRSTUVWXYZ[]^_`abcdefghijklmnz{|}~☇☈☉☊☋☌☍☎☏☐☑☒☓☚☛☜☝☞☟☠☡☢☣☤☥买乱乲乳乴乵乶乷乸乹乺乻乼乽癩羅蘿螺裸邏樂洛烙珞落酪駱亂👩🏼‍🦯👩‍❤️‍👨👩‍❤️‍👩👨‍❤️‍👨👩‍❤️‍💋‍👨👩‍❤️‍💋‍👩👨‍👩‍👦👨‍❤️‍💋‍👨👨‍👩‍👧👩‍👩‍👧‍👧👩‍👦👗👮🏿‍♀️👮🏿👮🏽‍♂️";
  const message = ogMessage;

  // a is sending encrypted text to b
  const aKeyPair = new KeyPair();
  const bKeyPair = new KeyPair();
  const bPublicKeyString = bKeyPair.publicKey.toString();
  const bPublicKey = new PublicKey(bPublicKeyString);

  const plainText = new PlainText(message);
  const encryptText = await plainText.encrypt(aKeyPair.privateKey, bPublicKey);
  const encryptedMessage = new EncryptedText(encryptText.content);

  const bPrivateKeyString = bKeyPair.privateKey.toString();
  const bPrivateKey = new PrivateKey(bPrivateKeyString);

  const decryptText = await encryptedMessage.decrypt(bPrivateKey);

  expect(plainText.name).toMatchInlineSnapshot('"decrypted.txt"');
  expect(encryptText.name).toMatchInlineSnapshot('"encrypted.txt"');

  expect(decryptText.content).toBe(message);
}, 60000);

it("should encrypt then decrypt random buffer", async () => {
  const randomBuffer = fs.readFileSync(
    path.join(__dirname, "./fixtures/Macaca_nigra_self-portrait_large.jpg")
  );
  const file = new File([randomBuffer], "Macaca_nigra_self-portrait_large.jpg");
  const fileBuffer = await file.arrayBuffer();

  // a is sending files to b
  const aKeyPair = new KeyPair();
  const bKeyPair = new KeyPair();

  const plainFile = new PlainFile(fileBuffer, file.name);
  const encryptBuffer = await plainFile.encrypt(
    aKeyPair.privateKey,
    bKeyPair.publicKey
  );
  const encryptFile = new File(
    [new Uint8Array(encryptBuffer.buffer)],
    "encrypted-testFile.jpg"
  );
  const encryptedFile = new EncryptedFile(
    await encryptFile.arrayBuffer(),
    encryptFile.name
  );

  const decryptFile = await encryptedFile.decrypt(bKeyPair.privateKey);

  // just to show that toStrictEqual can compare two ArrayBuffers
  expect(new Uint8Array([1]).buffer).toStrictEqual(new Uint8Array([1]).buffer);
  expect(new Uint8Array([1]).buffer).not.toStrictEqual(
    new Uint8Array([2]).buffer
  );
  expect(decryptFile.buffer).toStrictEqual(fileBuffer);
}, 60000);
