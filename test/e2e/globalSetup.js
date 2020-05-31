const path = require("path");
const { PORT } = require("./constants");
const { setup } = require("jest-dev-server");

module.exports = async function () {
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
};
