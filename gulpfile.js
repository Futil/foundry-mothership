const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer').default;
const sass = require('gulp-sass')(require('sass'));

/* ----------------------------------------- */
/*  Compile Sass
/* ----------------------------------------- */

// Small error handler helper function.
function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

const SYSTEM_SCSS = ["scss/**/*.scss"];
function compileScss() {
  // Configure options for sass output. For example, 'expanded' or 'nested'
  let options = {
    outputStyle: 'expanded'
  };
  return gulp.src(SYSTEM_SCSS)
    .pipe(
      sass(options)
        .on('error', handleError)
    )
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(gulp.dest("./css"))
}
const css = gulp.series(compileScss);

/* ----------------------------------------- */
/*  Copy System Files to Dist
/* ----------------------------------------- */

function copySystemFiles() {
  return gulp.src([
    'system.json',
    'template.json',
    'README.md',
    'css/**/*',
    'data/**/*',
    'images/**/*',
    'lang/**/*',
    'lib/**/*',
    'module/**/*',
    'packs/**/*',
    'templates/**/*'
  ], { 
    base: '.',
    encoding: false  // This ensures binary files are handled correctly
  })
    .pipe(gulp.dest('./dist'));
}

const build = gulp.series(compileScss, copySystemFiles);

/* ----------------------------------------- */
/*  Watch Updates
/* ----------------------------------------- */

function watchUpdates() {
  gulp.watch(SYSTEM_SCSS, css);
}

function watchUpdatesWithBuild() {
  gulp.watch(SYSTEM_SCSS, css);
  gulp.watch([
    'system.json',
    'template.json',
    'data/**/*',
    'images/**/*',
    'lang/**/*',
    'lib/**/*',
    'module/**/*',
    'packs/**/*',
    'templates/**/*'
  ], copySystemFiles);
}

/* ----------------------------------------- */
/*  Export Tasks
/* ----------------------------------------- */

exports.default = gulp.series(
  compileScss,
  watchUpdates
);
exports.css = css;
exports.build = build;
exports['build:watch'] = gulp.series(
  compileScss,
  copySystemFiles,
  watchUpdatesWithBuild
);
