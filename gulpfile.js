const { src, dest, series, parallel, watch } = require("gulp");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");
const { development, production } = require("gulp-environments");
const htmlmin = require("gulp-htmlmin");
const hash = require("gulp-hash-filename");
const insert = require("gulp-insert");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const del = require("del");
const webpack = require("webpack");
const workboxBuild = require("workbox-build");
const browserSync = require("browser-sync").create();
const path = require("path");
const through = require("through2");
const Handlebars = require("handlebars");
const glob = require("glob");
const fs = require("fs");
const removeClass = require("postcss-remove-classes").default;

sass.compiler = require("sass");

function copyImages() {
  return src("./images/**/*").pipe(dest("./dist/images"));
}

function copyTxts() {
  return src("./txt/**/*").pipe(dest("./dist"));
}

function copyFavicons() {
  return src("./favicon/**/*").pipe(dest("./dist"));
}

function copyOpenGraphs() {
  return src("./open-graph/**/*").pipe(dest("./dist/fbog"));
}

function copyFileIcons() {
  return src("./node_modules/file-icon-vectors/dist/icons/vivid/*.svg").pipe(dest("./dist/icons/vivid"));
}

function copyIconDownloads() {
  return src("./icon-download/**/*").pipe(dest("./dist/icon-download"));
}

function typescript(cb) {
  del(["./dist/**/*.js", "!./dist/webcomponents/**/*.js"]);

  const compiler = production()
    ? webpack(glob.sync("./src/**/webpack.prod.config.js").map(require))
    : webpack(glob.sync("./src/**/webpack.dev.config.js").map(require));

  compiler.run((err, stats) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(stats.toString({ colors: true }));

    cb();
  });
}

function scss() {
  del(["./dist/**/*.css"]);

  return src(["./src/**/*.scss", "!./src/common/**/*.scss"])
    .pipe(development(sourcemaps.init()))
    .pipe(sass.sync({ includePaths: ["./node_modules"] }).on("error", sass.logError))
    .pipe(postcss([removeClass(["mdc-ripple-upgraded--background-focused", ".mdc-button--raised:focus"])]))
    .pipe(production(postcss([autoprefixer(), cssnano()])))
    .pipe(development(sourcemaps.write()))
    .pipe(hash())
    .pipe(dest("./dist"));
}

function registerHandlebarsPartials() {
  glob.sync("./src/common/modules/**/*.html").forEach(filePath => {
    const content = fs.readFileSync(filePath, "utf8");
    const firstLine = content.split("\n")[0].replace(/\ /g, "");
    const partialName = firstLine.replace("<!--partialName=", "").replace("-->", "");

    if (partialName === "register-sw" && development()) {
      Handlebars.registerPartial(partialName, "");
      return;
    } // ignore register-sw partial at development

    if (partialName !== firstLine)
      Handlebars.registerPartial(partialName, content.substring(content.indexOf("\n"), content.length));
  });

  Handlebars.registerHelper("safeVal", (value, safeValue) => {
    const out = value || safeValue;
    return new Handlebars.SafeString(out);
  });

  Handlebars.registerHelper("ifEquals", (arg1, arg2, options) => {
    return arg1 == arg2 ? options.fn(this) : options.inverse(this);
  });

  Handlebars.registerHelper("json", arg1 => {
    return JSON.parse(arg1);
  });
}

function html() {
  registerHandlebarsPartials();
  return src(["./src/**/*.html", "!./src/common/modules/**/*.html"])
    .pipe(
      through.obj((chunk, enc, cb) => {
        chunk.contents = handlebarsProcess(chunk);

        cb(null, chunk);
      })
    )
    .pipe(production(htmlmin({ collapseWhitespace: true })))
    .pipe(dest("./dist"));
}

const getFilesBlobRelativeTo = (relativePath, blob) => {
  return glob
    .sync(path.join(relativePath, blob))
    .map(filePath => path.relative(relativePath, filePath))
    .map(filePath => (filePath.includes("./") ? filePath : "./" + filePath));
};

function handlebarsProcess(chunk) {
  const equivalentDistPath = path.dirname(chunk.path.replace("src", "dist"));
  const cssPaths = getFilesBlobRelativeTo(equivalentDistPath, "styles-*.css");
  const vendorsPaths = getFilesBlobRelativeTo(equivalentDistPath, "vendors-*.js");
  const mainPaths = getFilesBlobRelativeTo(equivalentDistPath, "main-*.js");

  const template = Handlebars.compile(chunk.contents.toString());
  const compiled = template({ css: cssPaths, vendorsJs: vendorsPaths, mainJs: mainPaths });

  return Buffer.from(compiled);
}

function serviceWorker() {
  return Promise.all(
    glob
      .sync("./dist/**/index.html")
      .map(p => path.dirname(p))
      .map(dir =>
        workboxBuild.generateSW({
          globDirectory: dir,
          globPatterns: [
            "../dist/**/*.{json,svg,png,webmanifest}",
            "../../dist/**/*.{json,svg,png,webmanifest}",
            "**/*.{html,js,css}",
          ],
          swDest: path.join(dir, "sw.js"),
          sourcemap: false,
          ignoreURLParametersMatching: [/.*/],
          runtimeCaching: [
            { urlPattern: /^https:\/\/fonts\.googleapis\.com/, handler: "StaleWhileRevalidate" },
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
        })
      )
  );
}

function clean() {
  return del(["./dist/**"]);
}

function watchAll() {
  watch("./src/**/*.ts", series(typescript, html));
  watch("./src/**/*.scss", series(scss, html));
  watch("./src/**/*.html", html);
}

async function serve() {
  await del(["./dist/**/sw.js"]); // remvoe all service workers for testing

  const reload = done => {
    browserSync.reload();
    done();
  };

  browserSync.init({
    server: {
      baseDir: "./dist",
    },
  });

  watch("./src/**/*.ts", series(typescript, html, reload));
  watch("./src/**/*.scss", series(scss, html, reload));
  watch("./src/**/*.html", series(html, reload));
}

const copy = parallel(copyImages, copyTxts, copyFavicons, copyOpenGraphs, copyFileIcons, copyIconDownloads);
const build = series(clean, parallel(copy, typescript, scss), html, serviceWorker);

exports.watch = series(build, watchAll);
exports.clean = clean;
exports.build = build;
exports.serve = series(build, serve);

exports.default = build;
