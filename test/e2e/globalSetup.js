const path = require("path");
const { PORT } = require("./constants");
const { setup } = require("jest-dev-server");

module.exports = async function () {
  if (process.env.TEST_WITH_DIST) {
    await setup([
      {
        command: `serve ./dist -l ${PORT} -s`,
        launchTimeout: 60000,
        port: PORT,
        options: {
          cwd: path.join(__dirname, "..", ".."),
        },
      },
    ]);
  } else {
    await setup([
      {
        command: `vue-cli-service serve --port ${PORT} --mode production`,
        launchTimeout: 60000,
        port: PORT,
        options: {
          cwd: path.join(__dirname, "..", ".."),
          env: { ...process.env, TEST: true, NODE_ENV: "production" },
        },
      },
    ]);
  }
};
