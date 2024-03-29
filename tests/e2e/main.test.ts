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
  await astroGoto(encryptPage, encryptLink!);

  const message =
    "!#$%&()*MNOPQRSTUVWXYZ[]^_`abcdefghijklmnz{|}~☇☈☉☊☋☌☍☎☏☐☑☒☓☚☛☜☝☞☟☠☡☢☣☤☥买乱乲乳乴乵乶乷乸乹乺乻乼乽癩羅蘿螺裸邏樂洛烙珞落酪駱亂👩🏼‍🦯👩‍❤️‍👨👩‍❤️‍👩👨‍❤️‍👨👩‍❤️‍💋‍👨👩‍❤️‍💋‍👩👨‍👩‍👦👨‍❤️‍💋‍👨👨‍👩‍👧👩‍👩‍👧‍👧👩‍👦👗👮🏿‍♀️👮🏿👮🏽‍♂️";

  await retry(async () => {
    const textarea = encryptPage.locator("textarea:not([readonly])");
    await textarea.clear();
    await textarea.fill(message);

    await Promise.all([
      encryptPage.waitForSelector(".loading-bar", { timeout: 5 * 1000 }),
      encryptPage.locator("button").filter({ hasText: "encrypt" }).click(),
    ]);
  }, 3);
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
  await astroGoto(decryptPage, decryptLink!);

  await retry(async () => {
    const textarea = decryptPage.locator("textarea:not([readonly])");
    await textarea.clear();
    await textarea.fill(encryptedMessage);

    await Promise.all([
      decryptPage.waitForSelector(".loading-bar", { timeout: 5 * 1000 }),
      decryptPage.locator("button").filter({ hasText: "decrypt" }).click(),
    ]);
  }, 3);
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
  test.slow();

  await page.goto("/");

  await page.waitForSelector(".loading-bar", { state: "detached" });

  const encryptLink = await page
    .locator("#encryption-link-card a")
    .getAttribute("href");
  const encryptPage = await context.newPage();
  encryptPage.on("console", console.log);
  await astroGoto(encryptPage, encryptLink!);

  const file1Content = "test1";
  const file2Content = "test2";

  const [[encryptedFile1Download, encryptedFile2Download]] = await retry(
    async () => {
      const [plainFileChooser] = await Promise.all([
        encryptPage.waitForEvent("filechooser", { timeout: 5 * 1000 }),
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

      return await Promise.all([
        waitForDownloads(encryptPage, 2),
        encryptPage.locator("button").filter({ hasText: "encrypt" }).click(),
      ]);
    },
    3
  );

  const decryptLink = await page
    .locator("#decryption-link-card a")
    .getAttribute("href");
  const decryptPage = await context.newPage();
  decryptPage.on("console", console.log);
  await astroGoto(decryptPage, decryptLink!);

  const [[decryptedFile1Download, decryptedFile2Download]] = await retry(
    async () => {
      const [encryptedFileChooser] = await Promise.all([
        decryptPage.waitForEvent("filechooser", { timeout: 5 * 1000 }),
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

      return await Promise.all([
        waitForDownloads(decryptPage, 2),
        decryptPage.locator("button").filter({ hasText: "decrypt" }).click(),
      ]);
    },
    3
  );

  expect(await getDownloadContentString(decryptedFile1Download)).toBe(
    file1Content
  );
  expect(await getDownloadContentString(decryptedFile2Download)).toBe(
    file2Content
  );
});

function waitForDownloads(page: Page, count: number): Promise<Download[]> {
  return Promise.race([
    page.waitForTimeout(30 * 1000).then(() => {
      throw new Error("Timeout waiting for downloads");
    }),
    new Promise<Download[]>((resolve) => {
      const downloads: Download[] = [];
      const listener = (download: Download) => {
        downloads.push(download);

        if (downloads.length === count) {
          page.off("download", listener);
          resolve(downloads);
        }
      };

      page.on("download", listener);

      return downloads;
    }),
  ]);
}

async function downloadAndGetContent(
  page: Page,
  downloadButtonParent?: Page | ElementHandle
) {
  const downloadButton = await (downloadButtonParent ?? page).$(
    'button[aria-label="Download"]'
  );

  const [download] = await Promise.all([
    page.waitForEvent("download", { timeout: 5 * 1000 }),
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

/**
 * returns a promise that resolves when the page and all astro components have loaded
 */
async function astroGoto(page: Page, path: string) {
  console.log("opening", path);

  await Promise.all([
    page.waitForFunction(
      () => document.querySelectorAll("astro-island[ssr]").length === 0
    ),
    page.goto(path),
  ]);
}

async function retry<T>(
  fn: () => Promise<T>,
  retries: number,
  delay: number = 0
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retry(fn, retries - 1, delay);
    } else {
      throw error;
    }
  }
}
