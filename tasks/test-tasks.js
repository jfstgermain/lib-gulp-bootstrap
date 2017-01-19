const gulp          = require('gulp');
const _             = require('lodash');
const mocha         = require('gulp-mocha');
const istanbul      = require('gulp-istanbul');
const argv          = require('yargs').argv;
const remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul');

/**
 * Code instrumentation for istanbul
 * @param  {String} rootDir the root directory where the transpiled code was written
 * @return {[type]}         [description]
 */
function preTest (rootDir) {
  return () => gulp.src(`${rootDir}/lib/**/*.js`)
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
}

/**
* Rewrite Istanbul reports using typescript source file references (using
* generated source maps)
*/
function remapCoverageFiles () {
  const coverageDir = `${process.cwd()}/coverage`;

  return gulp.src(`${coverageDir}/coverage-final.json`)
  .pipe(remapIstanbul({
    reports: {
      html: coverageDir,
      text: null,
      lcovonly: `${coverageDir}/lcov.info`,
    },
  }));
}

function runTests (rootDir, testDir) {
  const mochaOpts = {
    require: [`${rootDir}/test/utils/common`],
    reporter: argv.reporter || 'spec',
  };

  if (argv.reporterOutput) {
    _.set(mochaOpts, 'reporterOptions.output', argv.reporterOutput)
  }

  return () => gulp.src(`${rootDir}/test/${testDir}/**/*.js`)
    .pipe(mocha(mochaOpts))
    .once('error', () => process.exit(1))
    // we only need the json report for the `remapIstanbul` module
    .pipe(istanbul.writeReports({
      reporters: ['json'],
    }))
    // .pipe(istanbul.enforceThresholds({
    //   thresholds: { global: 90 },
    // }))
    .on('end', remapCoverageFiles);
}

/**
 * Runs unit tests under `test/unit/`
 * @param  {String} rootDir the root directory where the transpiled was written
 */
function runUnitTests (rootDir) {
  return runTests(rootDir, 'unit');
}

function runApiTests (rootDir) {
  return runTests(rootDir, 'api');
}

module.exports = {
  runUnitTests,
  runApiTests,
  preTest,
};
