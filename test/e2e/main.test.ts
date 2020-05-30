import crypto from "crypto";
import fs from "fs";
import path from "path";

import { toMatchImageSnapshot } from "jest-image-snapshot";
import playwright from "playwright";

declare const device: { viewport: { width: number; height: number } };
declare const context: playwright.BrowserContext;
declare const browserType: "chromium" | "firefox" | "webkit";
declare const screenshotDevices: typeof device[];

expect.extend({ toMatchImageSnapshot });
jest.setTimeout(60000);

const TEST_STRING =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
const TEST_FILES = [
  path.join(__dirname, "test-files", "Archive.zip"),
  path.join(__dirname, "test-files", "Macaca_nigra_self-portrait_large.jpg"),
  path.join(__dirname, "test-files", "Test_card.png"),
  path.join(__dirname, "test-files", "Test.png"),
];
const COLOR_SCHEMES = ["light", "dark", "no-preference"] as const;

const originalFilesMD5s = TEST_FILES.map((filePath) =>
  crypto.createHash("md5").update(fs.readFileSync(filePath)).digest("base64")
);

let homePage: playwright.Page;

beforeAll(async () => {
  homePage = await context.newPage();
  await homePage.goto("http://localhost:3000");
  await homePage.waitForSelector("#full-screen-loading-overlay", {
    state: "hidden",
  });
  await removeAnimations(homePage);
});

afterAll(async () => {
  await homePage.close();
});

describe("home page", () => {
  test("title is correct", async () => {
    expect(await homePage.title()).toBe(
      "SecretDrop.io - Generate New Key Pair"
    );
  });

  test("faq", async () => {
    await homePage.click("#top-bar > div > .button-container > button");

    expect(
      await homePage.waitForFunction(
        () => document.querySelector("#faq")!.getBoundingClientRect().y <= 1
      )
    ).toBeTruthy();

    await homePage.click(
      "#faq > .fab-container > button:not(.mdc-fab--exited)"
    );

    expect(
      await homePage.waitForFunction(
        () => document.querySelector("#top-bar")!.getBoundingClientRect().y <= 1
      )
    ).toBeTruthy();

    await removeFAQ(homePage);
  });

  testSnapshot(
    () => homePage,
    [
      "#encryption-link-card > div.link-card-url-container > a",
      "#decryption-link-card > div.link-card-url-container > a",
    ],
    true
  );

  describe("encryption link", () => {
    let encryptionLink: string;

    beforeAll(async () => {
      const encryptionLinkElement = await homePage.$(
        "#encryption-link-card > div.link-card-url-container > a"
      );
      encryptionLink = (await encryptionLinkElement!.getAttribute("href"))!;
    });

    testCopyAndDownload(
      () => homePage,
      "#encryption-link-card > div.bottom-bar-container > div.bottom-bar > button:nth-child(2)",
      "#encryption-link-card > div.bottom-bar-container > div.bottom-bar > button:nth-child(1)",
      () => encryptionLink
    );
  });

  describe("decryption link", () => {
    let decryptionLink: string;

    beforeAll(async () => {
      const decryptionLinkElement = await homePage.$(
        "#decryption-link-card > div.link-card-url-container > a"
      );
      decryptionLink = (await decryptionLinkElement!.getAttribute("href"))!;
    });

    testCopyAndDownload(
      () => homePage,
      "#decryption-link-card > div.bottom-bar-container > div.bottom-bar > button:nth-child(2)",
      "#decryption-link-card > div.bottom-bar-container > div.bottom-bar > button:nth-child(1)",
      () => decryptionLink
    );
  });
});

describe("encrypt-decrypt", () => {
  let encryptedText: string;
  const encryptedFiles: string[] = [];

  describe("encrypt page", () => {
    let encryptPage: playwright.Page;
    let inputTextarea: playwright.ElementHandle<HTMLTextAreaElement>;
    let clearButton: playwright.ElementHandle<HTMLButtonElement>;
    let resultTextarea: playwright.ElementHandle<HTMLTextAreaElement>;

    beforeAll(async () => {
      [encryptPage] = await Promise.all([
        context.waitForEvent("page"),
        await homePage.click(
          "#encryption-link-card .link-card-url-container > a"
        ),
      ]);
      await waitForLoading(encryptPage);
      await removeAnimations(encryptPage);

      await encryptPage.waitForSelector(
        "#encrypt-card div.textarea-container > textarea:not(disabled)"
      );
      inputTextarea = (await encryptPage.$(
        "#encrypt-card div.textarea-container > textarea"
      )) as playwright.ElementHandle<HTMLTextAreaElement>;
      clearButton = (await encryptPage.$(
        "#encrypt-card div.button-container > .clear-button"
      )) as playwright.ElementHandle<HTMLButtonElement>;
      resultTextarea = (await encryptPage.$(
        "#encrypt-card div.result-container > div.result-textarea-container > textarea"
      )) as playwright.ElementHandle<HTMLTextAreaElement>;

      await removeFAQ(encryptPage);
    });

    afterAll(async () => {
      await encryptPage.close();
    });

    test("title is correct", async () => {
      expect(await encryptPage.title()).toBe("Encrypt");
    });

    test("clear text before clicking encrypt", async () => {
      await inputTextarea.fill(TEST_STRING);
      expect(
        await inputTextarea.evaluate((el: HTMLTextAreaElement) => el.value)
      ).toBe(TEST_STRING);

      await clearButton.click();
      expect(
        await inputTextarea.evaluate((el: HTMLTextAreaElement) => el.value)
      ).toBe("");
    });

    describe("text encryption", () => {
      beforeAll(async () => {
        await inputTextarea.fill(TEST_STRING);
        await encryptPage.click(
          "#encrypt-card div.button-container > .encrypt-button"
        );
        await waitForLoading(encryptPage);

        encryptedText = await resultTextarea.evaluate(
          (el: HTMLTextAreaElement) => el.value
        );
      });

      testSnapshot(() => encryptPage, [
        () => inputTextarea,
        () => resultTextarea,
      ]);

      testCopyAndDownload(
        () => encryptPage,
        "div.card div.result-container > div.bottom-bar-container > div.bottom-bar > button:nth-child(2)",
        "div.card div.result-container > div.bottom-bar-container > div.bottom-bar > button:nth-child(1)",
        () => encryptedText
      );

      test("clear text after clicking encrypt", async () => {
        await clearButton.click();
        expect(
          await inputTextarea.evaluate((el: HTMLTextAreaElement) => el.value)
        ).toBe("");
      });
    });

    describe("file encryption", () => {
      test("encrypt files", async () => {
        if (browserType === "webkit") return;

        const [fileChooser] = await Promise.all([
          encryptPage.waitForEvent("filechooser"),
          await encryptPage.click(
            "#encrypt-card div.file-drop-container > div.file-drop-clickable-and-preview-container > .file-drop-clickable"
          ),
        ]);

        await fileChooser.setFiles(TEST_FILES);

        await encryptPage.click(
          "#encrypt-card div.button-container > .encrypt-button"
        );

        for (let i = 0; i < TEST_FILES.length; i++) {
          const download = await encryptPage.waitForEvent("download");

          encryptedFiles.push((await download.path())!);
        }

        expect(
          (
            await encryptPage.$$(
              "#encrypt-card div.file-drop-container > div.file-drop-clickable-and-preview-container > div.file-preview-container > div.file-preview"
            )
          ).length
        ).toBe(TEST_FILES.length);

        await clearButton.click();
      });

      testSnapshot(() => encryptPage);

      describe("cleared with clear button", () => {
        beforeAll(async () => {
          const [fileChooser] = await Promise.all([
            encryptPage.waitForEvent("filechooser"),
            await encryptPage.click(
              "#encrypt-card div.file-drop-container > div.file-drop-clickable-and-preview-container > .file-drop-clickable"
            ),
          ]);

          await fileChooser.setFiles(TEST_FILES);
        });

        test("clear files", async () => {
          await clearButton.click();
          expect(
            await encryptPage.$(
              "#encrypt-card div.file-drop-container > div.file-drop-clickable-and-preview-container > div.file-preview-container > div.file-preview"
            )
          ).toBeNull();
        });
      });

      describe("cleared with remove button", () => {
        beforeAll(async () => {
          const [fileChooser] = await Promise.all([
            encryptPage.waitForEvent("filechooser"),
            await encryptPage.click(
              "#encrypt-card div.file-drop-container > div.file-drop-clickable-and-preview-container > .file-drop-clickable"
            ),
          ]);

          await fileChooser.setFiles(TEST_FILES);
        });

        describe.each(TEST_FILES.map((_, index) => index).reverse())(
          "%i files left",
          (numberOfFilesLeft) => {
            test(`remove a file, should have ${numberOfFilesLeft}`, async () => {
              await encryptPage.click(
                "#encrypt-card div.file-drop-container > div.file-drop-clickable-and-preview-container > div.file-preview-container > div.file-preview > button.close-button"
              );
              expect(
                (
                  await encryptPage.$$(
                    "#encrypt-card div.file-drop-container > div.file-drop-clickable-and-preview-container > div.file-preview-container > div.file-preview"
                  )
                ).length
              ).toBe(numberOfFilesLeft);
            });
          }
        );
      });
    });
  });

  describe("decrypt page", () => {
    let decryptPage: playwright.Page;
    let inputTextarea: playwright.ElementHandle<HTMLTextAreaElement>;
    let clearButton: playwright.ElementHandle<HTMLButtonElement>;
    let resultTextarea: playwright.ElementHandle<HTMLTextAreaElement>;

    beforeAll(async () => {
      [decryptPage] = await Promise.all([
        context.waitForEvent("page"),
        await homePage.click(
          "#decryption-link-card .link-card-url-container > a"
        ),
      ]);
      await waitForLoading(decryptPage);
      await removeAnimations(decryptPage);

      await decryptPage.waitForSelector(
        "#decrypt-card div.textarea-container > textarea:not(disabled)"
      );
      inputTextarea = (await decryptPage.$(
        "#decrypt-card div.textarea-container > textarea"
      )) as playwright.ElementHandle<HTMLTextAreaElement>;
      clearButton = (await decryptPage.$(
        "#decrypt-card div.button-container > .clear-button"
      )) as playwright.ElementHandle<HTMLButtonElement>;
      resultTextarea = (await decryptPage.$(
        "#decrypt-card div.result-container > div.result-textarea-container > textarea"
      )) as playwright.ElementHandle<HTMLTextAreaElement>;

      await removeFAQ(decryptPage);
    });

    afterAll(async () => {
      await decryptPage.close();
    });

    test("title is correct", async () => {
      expect(await decryptPage.title()).toBe("Decrypt");
    });

    test("clear text before clicking decrypt", async () => {
      await inputTextarea.fill(encryptedText);
      expect(
        await inputTextarea.evaluate((el: HTMLTextAreaElement) => el.value)
      ).toBe(encryptedText);

      await clearButton.click();
      expect(
        await inputTextarea.evaluate((el: HTMLTextAreaElement) => el.value)
      ).toBe("");
    });

    describe("text decryption", () => {
      let decryptedText: string;

      beforeAll(async () => {
        await inputTextarea.fill(encryptedText);
        await decryptPage.click(
          "#decrypt-card div.button-container > .decrypt-button"
        );
        await waitForLoading(decryptPage);

        decryptedText = await resultTextarea.evaluate(
          (el: HTMLTextAreaElement) => el.value
        );
      });

      testSnapshot(() => decryptPage, [
        () => inputTextarea,
        () => resultTextarea,
      ]);

      testCopyAndDownload(
        () => decryptPage,
        "div.card div.result-container > div.bottom-bar-container > div.bottom-bar > button:nth-child(2)",
        "div.card div.result-container > div.bottom-bar-container > div.bottom-bar > button:nth-child(1)",
        () => decryptedText
      );

      test("clear text after clicking decrypt", async () => {
        await clearButton.click();
        expect(
          await inputTextarea.evaluate((el: HTMLTextAreaElement) => el.value)
        ).toBe("");
      });
    });

    describe("file decryption", () => {
      test("decrypt files", async () => {
        if (browserType === "webkit") return;

        const decryptMD5 = [];
        const [fileChooser] = await Promise.all([
          decryptPage.waitForEvent("filechooser"),
          await decryptPage.click(
            "#decrypt-card div.file-drop-container > div.file-drop-clickable-and-preview-container > .file-drop-clickable"
          ),
        ]);

        await fileChooser.setFiles(encryptedFiles);

        await decryptPage.click(
          "#decrypt-card div.button-container > .decrypt-button"
        );

        for (let i = 0; i < TEST_FILES.length; i++) {
          const download = await decryptPage.waitForEvent("download");

          decryptMD5.push(await downloadToMD5String(download));
        }

        expect(decryptMD5.sort()).toEqual(originalFilesMD5s.sort());

        await clearButton.click();
      });

      testSnapshot(() => decryptPage);

      describe("cleared with clear button", () => {
        beforeAll(async () => {
          const [fileChooser] = await Promise.all([
            decryptPage.waitForEvent("filechooser"),
            await decryptPage.click(
              "#decrypt-card div.file-drop-container > div.file-drop-clickable-and-preview-container > .file-drop-clickable"
            ),
          ]);

          await fileChooser.setFiles(TEST_FILES);
        });

        test("clear files", async () => {
          await clearButton.click();
          expect(
            await decryptPage.$(
              "#decrypt-card div.file-drop-container > div.file-drop-clickable-and-preview-container > div.file-preview-container > div.file-preview"
            )
          ).toBeNull();
        });
      });

      describe("cleared with remove button", () => {
        beforeAll(async () => {
          const [fileChooser] = await Promise.all([
            decryptPage.waitForEvent("filechooser"),
            await decryptPage.click(
              "#decrypt-card div.file-drop-container > div.file-drop-clickable-and-preview-container > .file-drop-clickable"
            ),
          ]);

          await fileChooser.setFiles(TEST_FILES);
        });

        test(`has ${TEST_FILES.length} files`, async () => {
          expect(
            (
              await decryptPage.$$(
                "#decrypt-card div.file-drop-container > div.file-drop-clickable-and-preview-container > div.file-preview-container > div.file-preview"
              )
            ).length
          ).toBe(TEST_FILES.length);
        });

        describe.each(TEST_FILES.map((_, index) => index).reverse())(
          "%i files left",
          (numberOfFilesLeft) => {
            test(`remove a file, should have ${numberOfFilesLeft}`, async () => {
              await decryptPage.click(
                "#decrypt-card div.file-drop-container > div.file-drop-clickable-and-preview-container > div.file-preview-container > div.file-preview > button.close-button"
              );
              expect(
                (
                  await decryptPage.$$(
                    "#decrypt-card div.file-drop-container > div.file-drop-clickable-and-preview-container > div.file-preview-container > div.file-preview"
                  )
                ).length
              ).toBe(numberOfFilesLeft);
            });
          }
        );
      });
    });
  });
});

function testCopyAndDownload(
  pageGetter: () => playwright.Page,
  copyButtonSelector: string,
  downloadButtonSelector: string,
  expectedStringGetter: () => string
) {
  test("copy", async () => {
    const page = pageGetter();
    const expectedString = expectedStringGetter();
    const copyEventSpy = jest.fn();
    const mockExecCommand = jest.fn();
    const copyEventSpyName = getRandomStringOfLength(5);
    const mockExecCommandName = getRandomStringOfLength(5);

    await page.exposeFunction(copyEventSpyName, copyEventSpy);
    await page.exposeFunction(mockExecCommandName, mockExecCommand);

    await page.evaluate(
      ([copyEventSpyName, mockExecCommandName]) => {
        const tempAddEventListener = HTMLSpanElement.prototype.addEventListener;

        //@ts-ignore
        HTMLSpanElement.prototype.addEventListener = function (type, listener) {
          if (type === "copy") {
            //@ts-ignore
            window[copyEventSpyName](this.innerText);
          }

          return tempAddEventListener.call(this, type, listener);
        };

        document.execCommand = (type) => {
          //@ts-ignore
          window[mockExecCommandName](type);
          return true;
        };
      },
      [copyEventSpyName, mockExecCommandName]
    );

    await page.click(copyButtonSelector);

    expect(
      await page.waitForSelector(".mdc-snackbar.mdc-snackbar--open")
    ).toBeTruthy();

    expect(copyEventSpy).toBeCalledWith(expectedString);
    expect(mockExecCommand).toBeCalledWith("copy");
  });

  test("download", async () => {
    if (browserType === "webkit") return;

    const page = pageGetter();
    const expectedString = expectedStringGetter();

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      await page.click(downloadButtonSelector),
    ]);

    const downloadedContent = await streamToString(download);

    expect(downloadedContent).toBe(expectedString);
  });
}

async function waitForLoading(page: playwright.Page) {
  await page.waitForSelector(".card div.loading-overlay", {
    state: "visible",
    timeout: 10000,
  });
  await page.waitForSelector(".card div.loading-overlay", {
    state: "hidden",
    timeout: 60000,
  });
}

function testSnapshot(
  pageGetter: () => playwright.Page,
  hideSelectors: (string | (() => playwright.JSHandle))[] = [],
  fullPage: boolean = false
) {
  describe("screenshot", () => {
    beforeAll(async () => {
      const page = pageGetter();

      await page.mouse.move(0, 0);
      await page.mouse.click(0, 0);
      await page.evaluate(() => {
        (document.activeElement as HTMLElement | undefined)?.blur();
      });

      await page.waitForTimeout(1000);

      await scrollToTop(page);

      await toggleSelectorsOpacity(page, hideSelectors, false);
    });

    afterAll(async () => {
      const page = pageGetter();

      await page.setViewportSize(device.viewport);
      await page.emulateMedia({ colorScheme: "light" });

      await toggleSelectorsOpacity(page, hideSelectors, true);
    });

    // takes too long for screen shots in chrome, only use the current device
    describe.each(screenshotDevices)("", ({ viewport }) => {
      beforeAll(async () => {
        const page = pageGetter();
        await page.setViewportSize(viewport);
      });

      test.each(COLOR_SCHEMES)(
        `${viewport.width}×${viewport.height} %s`,
        async (colorScheme) => {
          const page = pageGetter();

          await page.emulateMedia({ colorScheme });

          await page.mouse.move(0, 0);
          await page.mouse.click(0, 0);
          await page.evaluate(() => {
            (document.activeElement as HTMLElement | undefined)?.blur();
          });

          await scrollToTop(page);

          while (true) {
            expect(await page.screenshot()).toMatchImageSnapshot({
              dumpDiffToConsole: !!process.env.TRAVIS,
              customSnapshotsDir: path.join(
                __dirname,
                "__image_snapshots__",
                process.env.TRAVIS && process.platform === "darwin"
                  ? `travis_${process.platform}`
                  : process.platform,
                browserType,
                `${viewport.width}×${viewport.height}`,
                colorScheme
              ),
              customDiffDir: path.join(
                __dirname,
                "__image_snapshots__",
                process.env.TRAVIS && process.platform === "darwin"
                  ? `travis_${process.platform}`
                  : process.platform,
                "__diff_output__",
                browserType,
                `${viewport.width}×${viewport.height}`,
                colorScheme
              ),
            });

            if (
              (fullPage && (await hasReachBottom(page))) ||
              (!fullPage && (await hasGonePastMain(page)))
            ) {
              await scrollToTop(page);
              break;
            }

            await scrollDownOnePage(page);
          }
        }
      );
    });
  });
}

async function scrollToTop(page: playwright.Page) {
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });

  await page.waitForFunction(() => window.scrollY === 0);
}

async function scrollDownOnePage(page: playwright.Page) {
  const targetPosition = await page.evaluate(() => {
    const result = window.scrollY + window.innerHeight;

    window.scrollTo(0, result);

    return result;
  });

  await page.waitForFunction((targetPosition) => {
    const maxHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );

    return (
      window.scrollY === targetPosition ||
      window.scrollY + window.innerHeight >= maxHeight
    );
  }, targetPosition);
}

async function hasReachBottom(page: playwright.Page) {
  return await page.evaluate(() => {
    const maxHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );

    return window.scrollY + window.innerHeight >= maxHeight;
  });
}

async function hasGonePastMain(page: playwright.Page) {
  return await page.evaluate(() => {
    const main = document.querySelector("#app-main-container");

    return (
      window.scrollY + window.innerHeight >=
      main!.getBoundingClientRect().bottom
    );
  });
}

async function toggleSelectorsOpacity(
  page: playwright.Page,
  hideSelectors: (string | (() => playwright.JSHandle))[] = [],
  visible: boolean
) {
  const extra = [".mdc-snackbar", ".fab-container"];

  for (const selector of hideSelectors.concat(extra)) {
    const element =
      typeof selector === "string" ? await page.$(selector) : selector();

    if (visible)
      await element?.evaluate((el: HTMLAnchorElement) => {
        el.style.display = "";
      });
    else
      await element?.evaluate((el: HTMLAnchorElement) => {
        el.style.display = "none";
      });
  }
}

async function removeFAQ(page: playwright.Page) {
  await page.$eval("#faq", (el: HTMLDivElement) => (el.innerHTML = ""));
}

async function removeAnimations(page: playwright.Page) {
  await page.addStyleTag({
    content: `
      * {
        -webkit-transition: none !important;
        -moz-transition: none !important;
        -o-transition: none !important;
        -ms-transition: none !important;
        transition: none !important;

        -webkit-animation: none !important;
        -moz-animation: none !important;
        -o-animation: none !important;
        -ms-animation: none !important;
        animation: none !important;
      }
    `,
  });
}

async function downloadToMD5String(download: playwright.Download) {
  const stream = (await download.createReadStream())!;
  const chunks: Uint8Array[] = [];
  const fileBuffer: Buffer = await new Promise((resolve, reject) => {
    stream.on("data", (chunk: Uint8Array) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });

  return crypto.createHash("md5").update(fileBuffer).digest("base64");
}

async function streamToString(download: playwright.Download) {
  const stream = (await download.createReadStream())!;
  const chunks: Uint8Array[] = [];
  return await new Promise((resolve, reject) => {
    stream.on("data", (chunk: Uint8Array) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}

function getRandomStringOfLength(length: number) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
