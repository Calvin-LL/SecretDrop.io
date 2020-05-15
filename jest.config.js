module.exports = {
  projects: [
    {
      displayName: "unit",
      preset: "ts-jest",
      testEnvironment: "./test/unit/custom-jest-environment.js",
      testMatch: ["<rootDir>/test/unit/**/*.test.ts"],
      globals: {
        "ts-jest": {
          babelConfig: true,
        },
      },
      moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
      },
    },
  ],
};
