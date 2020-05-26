module.exports = {
  displayName: "unit",
  preset: "ts-jest",
  testEnvironment: "<rootDir>/custom-jest-environment.js",
  testMatch: ["<rootDir>/**/*.test.ts"],
  globals: {
    "ts-jest": {
      babelConfig: true,
    },
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/../../src/$1",
  },
};
