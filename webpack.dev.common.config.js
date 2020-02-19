module.exports = {
  mode: "development",
  target: "web",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.(t|j)s$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
          },
        },
      },
    ],
  },
  output: {
    filename: "[name]-[hash].js",
  },
  resolve: {
    extensions: [".js", ".ts"],
  },
  optimization: {
    moduleIds: "hashed",
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
          enforce: true,
        },
      },
    },
  },
};
