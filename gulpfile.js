const { src, dest, series, parallel, watch } = require("gulp");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");
const { development, production } = require("gulp-environments");
const htmlmin = require("gulp-htmlmin");
const babel = require("gulp-babel");
const terser = require("gulp-terser");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const del = require("del");

sass.compiler = require("node-sass");

// "browser-sync": "^2.26.7",

function typescript() {
  return src("./src/**/*.ts")
    .pipe(development(sourcemaps.init()))
    .pipe(babel())
    .pipe(production(terser()))
    .pipe(development(sourcemaps.write()))
    .pipe(dest("build"));
}

function scss() {
  return src("./src/**/*.scss")
    .pipe(development(sourcemaps.init()))
    .pipe(sass.sync().on("error", sass.logError))
    .pipe(production(postcss([autoprefixer(), cssnano()])))
    .pipe(development(sourcemaps.write()))
    .pipe(dest("build"));
}

function html() {
  return src("./src/**/*.html")
    .pipe(production(htmlmin({ collapseWhitespace: true })))
    .pipe(dest("build"));
}

function clean() {
  return del(["./build/**"]);
}

function watch() {
  watch("./src/**/*.ts", typescript);
  watch("./src/**/*.scss", scss);
  watch("./src/**/*.html", html);
}

const build = series(clean, parallel(typescript, scss, html));

exports.watch = watch;
exports.clean = clean;
exports.build = build;

exports.default = build;
