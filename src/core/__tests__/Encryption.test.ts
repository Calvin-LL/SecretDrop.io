import "./polyfills";

import { fileToArrayBuffer, getRandomDataOfLength } from "../Helpers";

import EncryptedFile from "../EncryptedFile";
import EncryptedMessage from "../EncryptedMessage";
import KeyPair from "../KeyPair";
import PlainFile from "../PlainFile";
import PlainMessage from "../PlainMessage";
import PrivateKey from "../PrivateKey";
import PublicKey from "../PublicKey";

describe("PlainMessage to and from EncryptedMessage", () => {
  test("test string", async () => {
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
  }, 120000);
});

describe("PlainMessage to and from EncryptedMessage", () => {
  test("test random buffer", async () => {
    const randomBuffer = getRandomDataOfLength(10000);
    const file = new File([randomBuffer], "testFile.txt");
    const fileContent = new Uint8Array(await fileToArrayBuffer(file));

    const myKeyPair = new KeyPair();

    const publicKey = new PublicKey(myKeyPair.getPublicKeyString());
    const privateKey = new PrivateKey(myKeyPair.getPrivateKeyString());

    const plainFile = new PlainFile(file, publicKey);
    const encryptBuffer = await plainFile.encrypt();
    const encryptFile = new File([encryptBuffer], "encrypted-testFile.txt");
    const encryptedFile = new EncryptedFile(encryptFile, privateKey);

    const decryptFile = await encryptedFile.decrypt();

    expect(decryptFile).toEqual(fileContent);
  }, 120000);
});
