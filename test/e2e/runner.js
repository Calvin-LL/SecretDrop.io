const JestRunner = require("jest-runner");
const {
  BROWSERS,
  DEFAULT_DESKTOP_DEVICE,
  DESKTOP_DEVICES,
  DEFAULT_MOBILE_DEVICE,
  MOBILE_DEVICES,
  RUN_IN_SERIAL,
} = require("./constants");

class Runner extends JestRunner {
  constructor(config, context) {
    super(config, context);
  }

  async runTests(tests, watcher, onStart, onResult, onFailure, options) {
    const browserTests = await Runner.getTests(tests);

    return super.runTests(browserTests, watcher, onStart, onResult, onFailure, {
      serial: RUN_IN_SERIAL,
    });
  }

  static async getTests(tests) {
    const browsersToTest = Runner.getBrowsersToTest();
    const devicesToTest = Runner.getDevicesToTest();

    return await Promise.all(
      tests.map(async (test) =>
        browsersToTest.flatMap((browser) =>
          devicesToTest.map(() =>
            Runner.getBrowserTest(test, browser, "desktop")
          )
        )
      )
    ).then((data) => data.flat());
  }

  static getBrowserTest(test, browserType, deviceType) {
    const { displayName } = test.context.config;
    const device =
      deviceType === "desktop" ? DEFAULT_DESKTOP_DEVICE : DEFAULT_MOBILE_DEVICE;
    const screenshotDevices =
      deviceType === "desktop" ? DESKTOP_DEVICES : MOBILE_DEVICES;

    return {
      ...test,
      context: {
        ...test.context,
        config: {
          ...test.context.config,
          browserType,
          device,
          screenshotDevices,
          displayName: {
            name: `${displayName.name} ${browserType} ${deviceType}`,
            color: "yellow",
          },
        },
      },
    };
  }

  static getBrowsersToTest() {
    switch (process.env.BROWSER) {
      case "chromium":
        return ["chromium"];
      case "firefox":
        return ["firefox"];
      case "webkit":
        return ["webkit"];

      default:
        return BROWSERS;
    }
  }

  static getDevicesToTest() {
    switch (process.env.DEVICE) {
      case "desktop":
        return ["desktop"];
      case "mobile":
        return ["mobile"];

      default:
        return ["desktop", "mobile"];
    }
  }
}

module.exports = Runner;
