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
    return await Promise.all(
      tests.map(async (test) =>
        BROWSERS.flatMap((browser) => [
          Runner.getBrowserTest(
            test,
            browser,
            DEFAULT_DESKTOP_DEVICE,
            DESKTOP_DEVICES,
            "desktop"
          ),
          Runner.getBrowserTest(
            test,
            browser,
            DEFAULT_MOBILE_DEVICE,
            MOBILE_DEVICES,
            "mobile"
          ),
        ])
      )
    ).then((data) => data.flat());
  }

  static getBrowserTest(
    test,
    browserType,
    device,
    screenshotDevices,
    deviceType
  ) {
    const { displayName } = test.context.config;
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
}

module.exports = Runner;
