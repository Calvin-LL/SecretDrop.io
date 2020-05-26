const { teardown } = require("jest-dev-server");

module.exports = async function () {
  await teardown();
};
