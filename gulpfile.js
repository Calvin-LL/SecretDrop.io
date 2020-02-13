const { src, dest, series, parallel, watch } = require("gulp");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");
const { development, production } = require("gulp-environments");
const htmlmin = require("gulp-htmlmin");
const hash = require("gulp-hash-filename");
const inject = require("gulp-inject");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const del = require("del");
const webpack = require("webpack");
const browserSync = require("browser-sync").create();

sass.compiler = require("node-sass");

function typescript(cb) {
  const compiler = production()
    ? webpack([require("./src/webpack.prod.config"), require("./src/encrypt/webpack.prod.config")])
    : webpack([require("./src/webpack.dev.config"), require("./src/encrypt/webpack.dev.config")]);

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
  return src("./src/**/*.scss")
    .pipe(development(sourcemaps.init()))
    .pipe(sass.sync().on("error", sass.logError))
    .pipe(production(postcss([autoprefixer(), cssnano()])))
    .pipe(development(sourcemaps.write()))
    .pipe(hash())
    .pipe(dest("dist"));
}

const html = parallel(htmlMain, htmlEncrypt);
const injectOptions = { removeTags: true };

function htmlMain() {
  return src("./src/index.html")
    .pipe(
      inject(src("./dist/vendors-*.js", { read: false }), {
        starttag: "<!-- inject:head:{{ext}} -->",
        ...injectOptions,
      })
    )
    .pipe(inject(src("./dist/styles-*.css", { read: false }), injectOptions))
    .pipe(inject(src("./dist/main-*.js", { read: false }), injectOptions))
    .pipe(production(htmlmin({ collapseWhitespace: true })))
    .pipe(dest("dist"));
}

function htmlEncrypt() {
  return src("./src/encrypt/index.html")
    .pipe(
      inject(src("./dist/encrypt/vendors-*.js", { read: false }), {
        starttag: "<!-- inject:head:{{ext}} -->",
        ...injectOptions,
      })
    )
    .pipe(inject(src("./dist/encrypt/styles-*.css", { read: false }), injectOptions))
    .pipe(inject(src("./dist/encrypt/main-*.js", { read: false }), injectOptions))
    .pipe(production(htmlmin({ collapseWhitespace: true })))
    .pipe(dest("dist/encrypt"));
}

function clean() {
  return del(["./dist/**"]);
}

function watchAll() {
  watch("./src/**/*.ts", series(typescript, html));
  watch("./src/**/*.scss", series(scss, html));
  watch("./src/**/*.html", html);
}

function serve() {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
  });

  watch("./src/**/*.ts", series(typescript, html, browserSync.reload));
  watch("./src/**/*.scss", series(scss, html, browserSync.reload));
  watch("./src/**/*.html", series(html, browserSync.reload));
}

const build = series(clean, parallel(typescript, scss), html);

exports.watch = series(build, watchAll);
exports.clean = clean;
exports.build = build;
exports.serve = series(build, serve);

exports.default = build;
