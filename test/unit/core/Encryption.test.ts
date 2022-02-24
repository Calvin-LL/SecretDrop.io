import path from "node:path";
import fs from "node:fs";
import { webcrypto } from "node:crypto";

import { expect, it } from "vitest";

import FileImpl from "./File";

import PublicKey from "@/core/PublicKey";
import PrivateKey from "@/core/PrivateKey";
import PlainMessage from "@/core/PlainMessage";
import PlainFile from "@/core/PlainFile";
import KeyPair from "@/core/KeyPair";
import EncryptedMessage from "@/core/EncryptedMessage";
import EncryptedFile from "@/core/EncryptedFile";

// eslint-disable-next-line no-global-assign
globalThis.window = {
  // @ts-expect-error @types/node's webcrypto definition is not exactly the same as window.crypto
  crypto: webcrypto,
};
// @ts-expect-error our FileImpl is not compatible with the dom's File
globalThis.File = FileImpl;

it("should encrypt then decrypt string", async () => {
  const ogMessage =
    "!#$%&()*MNOPQRSTUVWXYZ[]^_`abcdefghijklmnz{|}~☇☈☉☊☋☌☍☎☏☐☑☒☓☚☛☜☝☞☟☠☡☢☣☤☥买乱乲乳乴乵乶乷乸乹乺乻乼乽癩羅蘿螺裸邏樂洛烙珞落酪駱亂👩🏼‍🦯👩‍❤️‍👨👩‍❤️‍👩👨‍❤️‍👨👩‍❤️‍💋‍👨👩‍❤️‍💋‍👩👨‍👩‍👦👨‍❤️‍💋‍👨👨‍👩‍👧👩‍👩‍👧‍👧👩‍👦👗👮🏿‍♀️👮🏿👮🏽‍♂️";
  const message = ogMessage;

  const myKeyPair = new KeyPair();

  const publicKey = new PublicKey(myKeyPair.getPublicKeyString());
  const privateKey = new PrivateKey(myKeyPair.getPrivateKeyString());

  const plainMessage = new PlainMessage(message, publicKey);
  const encryptString = await plainMessage.encrypt();
  const encryptedMessage = new EncryptedMessage(encryptString, privateKey);

  const decryptString = await encryptedMessage.decrypt();

  expect(decryptString).toBe(message);
}, 60000);

it("should encrypt then decrypt random buffer", async () => {
  const randomBuffer = fs.readFileSync(
    path.join(__dirname, "./fixtures/Macaca_nigra_self-portrait_large.jpg")
  );
  const file = new File([randomBuffer], "Macaca_nigra_self-portrait_large.jpg");
  const fileContent = new Uint8Array(await file.arrayBuffer());

  const myKeyPair = new KeyPair();

  const publicKey = new PublicKey(myKeyPair.getPublicKeyString());
  const privateKey = new PrivateKey(myKeyPair.getPrivateKeyString());

  const plainFile = new PlainFile(file, publicKey);
  const encryptBuffer = await plainFile.encrypt();
  const encryptFile = new File([encryptBuffer], "encrypted-testFile.txt");
  const encryptedFile = new EncryptedFile(encryptFile, privateKey);

  const decryptFile = await encryptedFile.decrypt();

  expect(decryptFile).toEqual(fileContent);
}, 60000);
