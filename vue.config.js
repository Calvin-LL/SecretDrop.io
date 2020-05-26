const webpack = require("webpack");
const packageLock = require("./package-lock.json");
const { GenerateSW } = require("workbox-webpack-plugin");
const availabelIcons = require("file-icon-vectors/dist/icons/vivid/catalog.json");

const production = process.env.NODE_ENV === "production";

module.exports = {
  integrity: true,
  css: {
    loaderOptions: {
      postcss: production
        ? {
            plugins: [require("autoprefixer")],
          }
        : undefined,
      sass: {
        implementation: require("dart-sass"),
        webpackImporter: false,
        sassOptions: {
          includePaths: ["node_modules", "src"],
        },
      },
    },
  },
  chainWebpack: (config) => {
    config.module
      .rule("vue")
      .use("vue-svg-inline-loader")
      .loader("vue-svg-inline-loader");
  },
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        FILE_ICON_VECTORS_VERSION: JSON.stringify(
          packageLock.dependencies["file-icon-vectors"].version
        ),
      }),
      ...(production
        ? [
            new GenerateSW({
              additionalManifestEntries: [
                ...availabelIcons.map((iconName) => ({
                  url: `https://cdn.jsdelivr.net/npm/file-icon-vectors@${packageLock.dependencies["file-icon-vectors"].version}/dist/icons/vivid/${iconName}.svg`,
                  revision:
                    packageLock.dependencies["file-icon-vectors"].version,
                })),
              ],
              swDest: "sw.js",
              navigateFallback: "/index.html",
              navigateFallbackAllowlist: [/^\/encrypt/, /^\/decrypt/],
              sourcemap: false,
              clientsClaim: true,
              ignoreURLParametersMatching: [/.*/],
              runtimeCaching: [
                { urlPattern: /\.html$/, handler: "NetworkFirst" },
                {
                  urlPattern: /^https:\/\/fonts\.googleapis\.com/,
                  handler: "StaleWhileRevalidate",
                  options: { cacheName: "static-resources" },
                },
                {
                  urlPattern: /^https:\/\/fonts\.gstatic\.com/,
                  handler: "StaleWhileRevalidate",
                  options: { cacheName: "google-fonts-webfonts" },
                },
                {
                  urlPattern: /favicon/g,
                  handler: "StaleWhileRevalidate",
                  options: { cacheName: "favicon" },
                },
                {
                  urlPattern: /\.(?:xml|webmanifest|txt|ico)$/,
                  handler: "StaleWhileRevalidate",
                  options: { cacheName: "static-resources" },
                },
                {
                  urlPattern: /\.(?:js|css)$/,
                  handler: "CacheFirst",
                  options: { cacheName: "static-resources" },
                },
                {
                  urlPattern: /^https:\/\/cdn\.jsdelivr\.net/,
                  handler: "CacheFirst",
                  options: { cacheName: "file-icons" },
                },
                {
                  urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
                  handler: "CacheFirst",
                  options: { cacheName: "images" },
                },
              ],
            }),
          ]
        : []),
    ],
  },
};
