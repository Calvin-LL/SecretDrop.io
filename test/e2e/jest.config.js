module.exports = {
  displayName: "e2e",
  preset: "ts-jest",
  testMatch: ["<rootDir>/**/*.test.ts"],
  globals: {
    "ts-jest": {
      babelConfig: true,
    },
  },
  bail: 1,
  setupFilesAfterEnv: ["<rootDir>/setupFilesAfterEnv.js"],
  globalSetup: "<rootDir>/globalSetup.js",
  globalTeardown: "<rootDir>/globalTeardown.js",
  testEnvironment: "<rootDir>/testEnvironment.js",
  runner: "<rootDir>/runner.js",
};
