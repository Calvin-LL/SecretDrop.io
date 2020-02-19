const { src, dest, series, parallel, watch } = require("gulp");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");
const { development, production } = require("gulp-environments");
const htmlmin = require("gulp-htmlmin");
const hash = require("gulp-hash-filename");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const del = require("del");
const webpack = require("webpack");
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
  return src("./open-graph/**/*").pipe(dest("./dist"));
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

  return src("./src/**/*.scss")
    .pipe(development(sourcemaps.init()))
    .pipe(sass.sync({ includePaths: ["./node_modules"] }).on("error", sass.logError))
    .pipe(postcss([removeClass(["mdc-ripple-upgraded--background-focused", ".mdc-button--raised:focus"])]))
    .pipe(production(postcss([autoprefixer(), cssnano()])))
    .pipe(development(sourcemaps.write()))
    .pipe(hash())
    .pipe(dest("./dist"));
}

const registerHandlebarsPartials = () => {
  glob.sync("./src/common/modules/**/*.html").forEach(filePath => {
    const content = fs.readFileSync(filePath, "utf8");
    const firstLine = content.split("\n")[0].replace(/\ /g, "");
    const partialName = firstLine.replace("<!--partialName=", "").replace("-->", "");

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
};

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

const copy = parallel(copyImages, copyTxts, copyFavicons, copyOpenGraphs);
const build = series(clean, parallel(copy, typescript, scss), html);

exports.watch = series(build, watchAll);
exports.clean = clean;
exports.build = build;
exports.serve = series(build, serve);

exports.default = build;
