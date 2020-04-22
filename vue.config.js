const removeClass = require("postcss-remove-classes").default;

const production = process.env.NODE_ENV === "production";

module.exports = {
  integrity: true,
  pwa: {
    workboxOptions: {
      globPatterns: [
        "../dist/**/*.{json,svg,png,webmanifest}",
        "../../dist/**/*.{json,svg,png,webmanifest}",
        "**/*.{html,js,css}",
      ],
      sourcemap: false,
      ignoreURLParametersMatching: [/.*/],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com/,
          handler: "StaleWhileRevalidate",
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com/,
          handler: "CacheFirst",
          options: {
            cacheName: "google-fonts-webfonts",
            expiration: {
              maxAgeSeconds: 60 * 60 * 24 * 365,
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        { urlPattern: /\.(?:js|css)$/, handler: "CacheFirst" },
        { urlPattern: /\.html$/, handler: "NetworkFirst" },
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
          handler: "CacheFirst",
          options: {
            cacheName: "images",
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 30 * 24 * 60 * 60,
            },
          },
        },
      ],
    },
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: production
          ? [
              require("autoprefixer"),
              removeClass([
                "mdc-ripple-upgraded--background-focused",
                ".mdc-button--raised:focus",
              ]),
            ]
          : [
              removeClass([
                "mdc-ripple-upgraded--background-focused",
                ".mdc-button--raised:focus",
              ]),
            ],
      },
      sass: {
        implementation: require("dart-sass"),
        webpackImporter: false,
        sassOptions: {
          includePaths: ["node_modules", "src"],
        },
        prependData: '@import "assets/scss/global";',
      },
    },
  },
  chainWebpack: (config) => {
    config.module
      .rule("vue")
      .use("vue-svg-inline-loader")
      .loader("vue-svg-inline-loader");
  },
};
