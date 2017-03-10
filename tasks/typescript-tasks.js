const gulp       = require('gulp');
const del        = require('del');
const sourcemaps = require('gulp-sourcemaps');
const ts         = require('gulp-typescript');
const tslint     = require('gulp-tslint');
const gulpUtil   = require('gulp-util');
const gulpCopy   = require('gulp-copy');
const merge      = require('merge2');

const tsProject  = ts.createProject('tsconfig.json');
const tsDestPath = `${process.cwd()}/dist`;
const tsSrcPath  = `${process.cwd()}/src`;
const tsSrcGlob  = `${tsSrcPath}/**/*.ts`;
const tsRulesdir = `${process.cwd()}/node_modules/tslint-microsoft-contrib`;

/**
 * Deletes the `/dist` directory
 * @return {Promise}
 */
function clean () {
  return del([tsDestPath]);
}

/**
 * Transpiles the Typescript files to ES6 javascript files
 * @param  {stream} stream a gulp stream passed on in the execution chain
 * @return {stream}
 */
function transpile (stream) {
  // If no stream is passed, create one pointing to the `tsSrcGlob` source files
  if (!gulpUtil.isStream(stream)) {
    stream = gulp.src([tsSrcGlob]);
  }

  const tsResult = stream.pipe(sourcemaps.init())
    .pipe(tsProject());

  // Merge the two output streams, so this task is finished when
  // the IO of both operations is done.
  return merge([
    tsResult.js
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(tsDestPath)),
    // copy non js files to `dist/`
    gulp.src(`${tsSrcPath}/**/*(*.json|*.yaml|*.yml)`)
      .pipe(gulpCopy(tsDestPath, { prefix: 1 })),
  ]);
}

/**
 * Lint the typescript source files
 * @param  {stream} stream a gulp stream passed on in the execution chain
 * @return {stream}
 */
function lint (stream) {
  // If no stream is passed, create one pointing to the `tsSrcGlob` source files
  if (!gulpUtil.isStream(stream)) {
    stream = gulp.src([tsSrcGlob]);
  }

  return stream.pipe(tslint({
    formatter: 'verbose',
    rulesDirectory: tsRulesdir,
  })).pipe(tslint.report({
    emitError: true,
    summarizeFailureOutput: false,
  }));
}

/**
 * Continuously watch typescript files and lint them as they are modified
 * @param  {String} transpileTaskName the name identifying the transpiling task (see gulpfile.js)
 * @return {stream}
 */
function watch (contextGulp, transpileTaskName) {
  return () => contextGulp.watch(tsSrcGlob, [transpileTaskName]);
}

module.exports = {
  clean,
  transpile,
  lint,
  watch,
  tsSrcPath,
  tsSrcGlob,
  tsDestPath,
};
