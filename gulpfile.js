const { src, dest, series, parallel, watch } = require("gulp");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");
const { development, production } = require("gulp-environments");
const htmlmin = require("gulp-htmlmin");
const hash = require("gulp-hash-filename");
const inject = require("gulp-inject");
const include = require("gulp-include");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const del = require("del");
const webpack = require("webpack");
const browserSync = require("browser-sync").create();
const path = require("path");

sass.compiler = require("node-sass");

function copyImage() {
  return src("./image/**/*").pipe(dest("./dist/image"));
}

function copyWebcomponents() {
  return src("./node_modules/@webcomponents/webcomponentsjs/*.js").pipe(dest("./dist/webcomponents"));
}

function typescript(cb) {
  del(["./dist/**/*.js", "!./dist/webcomponents/**/*.js"]);

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
  del(["./dist/**/*.css"]);

  return src("./src/**/*.scss")
    .pipe(development(sourcemaps.init()))
    .pipe(sass.sync().on("error", sass.logError))
    .pipe(production(postcss([autoprefixer(), cssnano()])))
    .pipe(development(sourcemaps.write()))
    .pipe(hash())
    .pipe(dest("./dist"));
}

const html = parallel(htmlMain, htmlEncrypt);
const injectOptions = { removeTags: true, addRootSlash: false };
const distInjectSrc = filePath => src(filePath, { read: false, cwd: path.join(__dirname, "dist") });

function htmlMain() {
  return src("./src/index.html")
    .pipe(
      inject(distInjectSrc("./vendors-*.js"), {
        starttag: "<!-- inject:head:{{ext}} -->",
        ...injectOptions,
      })
    )
    .pipe(inject(distInjectSrc("./styles-*.css"), injectOptions))
    .pipe(inject(distInjectSrc("./main-*.js"), injectOptions))
    .pipe(include())
    .pipe(production(htmlmin({ collapseWhitespace: true })))
    .pipe(dest("./dist"));
}

function htmlEncrypt() {
  return src("./src/encrypt/index.html")
    .pipe(
      inject(distInjectSrc("./encrypt/vendors-*.js"), {
        starttag: "<!-- inject:head:{{ext}} -->",
        ...injectOptions,
      })
    )
    .pipe(inject(distInjectSrc("./encrypt/styles-*.css"), injectOptions))
    .pipe(inject(distInjectSrc("./encrypt/main-*.js"), injectOptions))
    .pipe(include())
    .pipe(production(htmlmin({ collapseWhitespace: true })))
    .pipe(dest("./dist/encrypt"));
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

const copy = parallel(copyWebcomponents, copyImage);
const build = series(clean, parallel(copy, typescript, scss), html);

exports.watch = series(build, watchAll);
exports.clean = clean;
exports.build = build;
exports.serve = series(build, serve);

exports.default = build;
