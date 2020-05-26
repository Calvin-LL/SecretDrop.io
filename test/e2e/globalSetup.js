const path = require("path");
const { PORT } = require("./constants");
const { setup } = require("jest-dev-server");

module.exports = async function () {
  await setup([
    {
      command: `vue-cli-service serve --port ${PORT} --mode development`,
      launchTimeout: 60000,
      port: PORT,
      options: {
        cwd: path.join(__dirname, "..", ".."),
        env: { ...process.env, NODE_ENV: "development" },
      },
    },
  ]);
};
