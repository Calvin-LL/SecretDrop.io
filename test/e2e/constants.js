const playwright = require("playwright");

const DEBUG = false;
const RUN_IN_SERIAL = process.env.CI === true;
const PORT = 3000;
const BROWSERS = ["chromium", "firefox", "webkit"];
const DEFAULT_DESKTOP_DEVICE = {
  viewport: {
    width: 1280,
    height: 720,
  },
};
const DESKTOP_DEVICES = [
  {
    viewport: {
      width: 2560,
      height: 720,
    },
  },
  {
    viewport: {
      width: 1440,
      height: 720,
    },
  },
  {
    viewport: {
      width: 1280,
      height: 720,
    },
  },
];
const DEFAULT_MOBILE_DEVICE = playwright.devices["iPhone 11"];
const MOBILE_DEVICES = [
  playwright.devices["iPad Pro 11 landscape"],
  playwright.devices["iPad Pro 11"],
  playwright.devices["iPad Mini landscape"],
  playwright.devices["iPad Mini"],
  playwright.devices["iPad (gen 7) landscape"],
  playwright.devices["iPad (gen 7)"],
  playwright.devices["Pixel 2 XL landscape"],
  playwright.devices["Pixel 2 XL"],
  playwright.devices["Pixel 2 landscape"],
  playwright.devices["Pixel 2"],
  playwright.devices["iPhone 11 Pro landscape"],
  playwright.devices["iPhone 11 Pro"],
  playwright.devices["iPhone 11 landscape"],
  playwright.devices["iPhone 11"],
  playwright.devices["Nexus 4 landscape"],
  playwright.devices["Nexus 4"],
];

module.exports = {
  DEBUG,
  PORT,
  BROWSERS,
  DESKTOP_DEVICES,
  MOBILE_DEVICES,
  DEFAULT_DESKTOP_DEVICE,
  DEFAULT_MOBILE_DEVICE,
  RUN_IN_SERIAL,
};
