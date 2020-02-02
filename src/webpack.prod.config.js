const common = require("../webpack.prod.common.config");
const path = require("path");

module.exports = {
  ...common,
  entry: path.join(__dirname, "index.ts"),
  output: {
    ...common.output,
    path: path.join(__dirname, "..", "dist"),
  },
};
