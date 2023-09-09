import {
  expect,
  test,
  type Download,
  type ElementHandle,
  type Page,
} from "@playwright/test";
import type stream from "node:stream";

test.describe("link download", () => {
  for (const type of ["encrypt", "decrypt"]) {
    test(`${type}ion link download`, async ({ page }) => {
      await page.goto("/");

      await page.waitForSelector(".loading-bar", { state: "detached" });

      const linkElement = await page.$(`#${type}ion-link-card a`);
      const link = await linkElement!.getAttribute("href");

      const card = await page.$(`#${type}ion-link-card`);

      const downloadedLink = await downloadAndGetContent(page, card!);

      expect(downloadedLink).toBe(link);
    });
  }
});

test("encrypt then decrypt text", async ({ page, context }) => {
  await page.goto("/");

  await page.waitForSelector(".loading-bar", { state: "detached" });

  const encryptLink = await page
    .locator("#encryption-link-card a")
    .getAttribute("href");
  const encryptPage = await context.newPage();
  encryptPage.on("console", console.log);
  await encryptPage.goto(encryptLink!);
  await encryptPage.waitForSelector("body[data-loaded]");

  const message =
    "!#$%&()*MNOPQRSTUVWXYZ[]^_`abcdefghijklmnz{|}~☇☈☉☊☋☌☍☎☏☐☑☒☓☚☛☜☝☞☟☠☡☢☣☤☥买乱乲乳乴乵乶乷乸乹乺乻乼乽癩羅蘿螺裸邏樂洛烙珞落酪駱亂👩🏼‍🦯👩‍❤️‍👨👩‍❤️‍👩👨‍❤️‍👨👩‍❤️‍💋‍👨👩‍❤️‍💋‍👩👨‍👩‍👦👨‍❤️‍💋‍👨👨‍👩‍👧👩‍👩‍👧‍👧👩‍👦👗👮🏿‍♀️👮🏿👮🏽‍♂️";

  await encryptPage.locator("textarea:not([readonly])").type(message);
  await Promise.all([
    encryptPage.waitForSelector(".loading-bar"),
    encryptPage.locator("button").filter({ hasText: "encrypt" }).click(),
  ]);
  await encryptPage.waitForSelector(".loading-bar", {
    state: "detached",
    timeout: 120 * 1000,
  });

  const encryptedMessage = await encryptPage
    .locator("textarea[readonly]")
    .inputValue();

  expect(await downloadAndGetContent(encryptPage)).toBe(encryptedMessage);

  const decryptLink = await page
    .locator("#decryption-link-card a")
    .getAttribute("href");
  const decryptPage = await context.newPage();
  decryptPage.on("console", console.log);
  await decryptPage.goto(decryptLink!);
  await decryptPage.waitForSelector("body[data-loaded]");

  await decryptPage.locator("textarea:not([readonly])").type(encryptedMessage);

  await Promise.all([
    decryptPage.waitForSelector(".loading-bar"),
    decryptPage.locator("button").filter({ hasText: "decrypt" }).click(),
  ]);
  await decryptPage.waitForSelector(".loading-bar", {
    state: "detached",
    timeout: 120 * 1000,
  });

  const decryptedMessage = await decryptPage
    .locator("textarea[readonly]")
    .inputValue();

  expect(await downloadAndGetContent(decryptPage)).toBe(decryptedMessage);
  expect(decryptedMessage).toBe(message);
});

test("encrypt then decrypt files", async ({ page, context }) => {
  await page.goto("/");

  await page.waitForSelector(".loading-bar", { state: "detached" });

  const encryptLink = await page
    .locator("#encryption-link-card a")
    .getAttribute("href");
  const encryptPage = await context.newPage();
  encryptPage.on("console", console.log);
  await encryptPage.goto(encryptLink!);
  await encryptPage.waitForSelector("body[data-loaded]");

  const file1Content = "test1";
  const file2Content = "test2";

  const [plainFileChooser] = await Promise.all([
    encryptPage.waitForEvent("filechooser"),
    encryptPage.locator("input[type=file]").click(),
  ]);
  await plainFileChooser.setFiles([
    {
      name: "test1.txt",
      mimeType: "text/plain",
      buffer: Buffer.from(file1Content),
    },
    {
      name: "test2.txt",
      mimeType: "text/plain",
      buffer: Buffer.from(file2Content),
    },
  ]);

  const [[encryptedFile1Download, encryptedFile2Download]] = await Promise.all([
    (async () => {
      const download1 = await encryptPage.waitForEvent("download");
      const download2 = await encryptPage.waitForEvent("download");

      return [download1, download2];
    })(),
    encryptPage.locator("button").filter({ hasText: "encrypt" }).click(),
  ]);

  const decryptLink = await page
    .locator("#decryption-link-card a")
    .getAttribute("href");
  const decryptPage = await context.newPage();
  decryptPage.on("console", console.log);
  await decryptPage.goto(decryptLink!);
  await decryptPage.waitForSelector("body[data-loaded]");

  const [encryptedFileChooser] = await Promise.all([
    decryptPage.waitForEvent("filechooser"),
    decryptPage.locator("input[type=file]").click(),
  ]);
  await encryptedFileChooser.setFiles([
    {
      name: "test1.txt",
      mimeType: "text/plain",
      buffer: await getDownloadContentBuffer(encryptedFile1Download),
    },
    {
      name: "test2.txt",
      mimeType: "text/plain",
      buffer: await getDownloadContentBuffer(encryptedFile2Download),
    },
  ]);

  const [[decryptedFile1Download, decryptedFile2Download]] = await Promise.all([
    (async () => {
      const download1 = await decryptPage.waitForEvent("download");
      const download2 = await decryptPage.waitForEvent("download");

      return [download1, download2];
    })(),
    decryptPage.locator("button").filter({ hasText: "decrypt" }).click(),
  ]);

  expect(await getDownloadContentString(decryptedFile1Download)).toBe(
    file1Content
  );
  expect(await getDownloadContentString(decryptedFile2Download)).toBe(
    file2Content
  );
});

async function downloadAndGetContent(
  page: Page,
  downloadButtonParent?: Page | ElementHandle
) {
  const downloadButton = await (downloadButtonParent ?? page).$(
    'button[aria-label="Download"]'
  );

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    downloadButton!.click(),
  ]);

  return getDownloadContentString(download);
}

async function getDownloadContentString(download: Download) {
  return (await getDownloadContentBuffer(download)).toString();
}

async function getDownloadContentBuffer(download: Download) {
  const downloadedContentStream = await download.createReadStream();
  const downloadedContent = await readStreamToBuffer(downloadedContentStream!);

  return downloadedContent;
}

async function readStreamToBuffer(
  readableStream: NodeJS.ReadStream | stream.Readable
): Promise<Buffer> {
  const chunks = [];

  for await (const data of readableStream) {
    chunks.push(data);
  }

  return Buffer.concat(chunks);
}
