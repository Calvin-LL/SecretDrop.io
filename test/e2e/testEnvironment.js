const NodeEnvironment = require("jest-environment-node");
const playwright = require("playwright");

const { DEBUG } = require("./constants");

class TestEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
    this._config = config;
  }

  async setup() {
    await super.setup();

    const { browserType, device, screenshotDevices } = this._config;

    this._browser = await playwright[browserType].launch({
      ...TestEnvironment.getArgsForBrowser(browserType),
      ...(DEBUG
        ? {
            headless: false,
            slowMo: 100,
          }
        : {}),
    });

    this.global.browserType = browserType;
    this.global.device = device;
    this.global.screenshotDevices = screenshotDevices;
    this.global.context = await this._browser.newContext({
      ...(browserType === "firefox"
        ? { viewport: device.viewport, hasTouch: !!device.hasTouch }
        : device),
      acceptDownloads: true,
      permissions: TestEnvironment.getPermissionsForBrowser(browserType),
    });
  }

  async teardown() {
    this._browser.close();
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }

  static getPermissionsForBrowser(browserType) {
    switch (browserType) {
      case "chromium":
        return ["clipboard-read", "clipboard-write"];
      case "firefox":
        return [];
      case "webkit":
        return [];
    }
  }

  static getArgsForBrowser(browserType) {
    switch (browserType) {
      case "chromium":
        return [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--font-render-hinting=none",
        ];
      case "firefox":
        return [];
      case "webkit":
        return [];
    }
  }
}

module.exports = TestEnvironment;
