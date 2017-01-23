const gulp          = require('gulp');
const _             = require('lodash');
const mocha         = require('gulp-mocha');
const istanbul      = require('gulp-istanbul');
const argv          = require('yargs').argv;
const remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul');
const fs            = require('fs');
const assert        = require('assert');
const path          = require('path');
const packageJson   = require('../package.json');
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

function runTests (rootDir, testDir, requiredModules = []) {
  // TODO: find a better way to do this and avoid using the module name in package.json...
  // (the module req-from used by gulp-mocha complicates things a bit)
  requiredModules.push(`${process.cwd()}/node_modules/${packageJson.name}/utils/test-common`);

  const mochaOpts = {
    require: requiredModules,
    reporter: argv.reporter || 'spec',
  };

  if (argv.reporterOutput) {
    _.set(mochaOpts, 'reporterOptions.output', argv.reporterOutput)
  }

  return () => {
    assert(fs.existsSync(`${rootDir}/test/${testDir}/`), `Test directory '${rootDir}/test/${testDir}/' doesn't exist!`);

    return gulp.src(`${rootDir}/test/${testDir}/**/*.js`)
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
}

/**
 * Runs unit tests under `test/unit/`
 * @param  {String} rootDir the root directory where the transpiled was written
 * @param  {Array} requiredModules required modules for running tests  Default
 *                                 ones used in `runTests` should be enough.
 */
function runUnitTests (rootDir, requiredModules) {
  return runTests(rootDir, 'unit', requiredModules);
}

/**
 * Runs unit tests under `test/api/`
 * @param  {String} rootDir the root directory where the transpiled was written
 * @param  {Array} requiredModules required modules for running tests  Default
 *                                 ones used in `runTests` should be enough.
 */
function runApiTests (rootDir, requiredModules) {
  return runTests(rootDir, 'api', requiredModules);
}

module.exports = {
  runUnitTests,
  runApiTests,
  preTest,
};
