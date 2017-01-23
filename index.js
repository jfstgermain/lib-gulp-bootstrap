const tsTasks           = require('./tasks/typescript-tasks');
const processMonitTasks = require('./tasks/process-monit-tasks');
const testTasks         = require('./tasks/test-tasks');
const guppy             = require('git-guppy');
const releaseFlows      = require('gulp-release-flows');
const taskListing       = require('gulp-task-listing');
const _                 = require('lodash');

function bindBaseTasks (gulp) {
  const guppyInstance = guppy(gulp);

  // Add release flows' module tasks
  releaseFlows(gulp);

  /**
   * Lint all custom TypeScript files.
   */
  gulp.task('lint', tsTasks.lint);

  /**
  * Remove all generated JavaScript files from TypeScript compilation.
  */
  gulp.task('clean', tsTasks.clean);

  /**
   * Compile TypeScript and include references to library and app .d.ts files.
   */
  gulp.task('transpile:clean:false', ['lint'], tsTasks.transpile);

  gulp.task('transpile:clean:true', ['lint', 'clean'], tsTasks.transpile);

  gulp.task('transpile', ['transpile:clean:true']);

  // [Test related tasks]
  // Instrument code for coverage
  gulp.task('pre-test', ['transpile'], testTasks.preTest(tsTasks.tsDestPath));

  // Run unit tests
  gulp.task('test:unit', ['pre-test'], testTasks.runUnitTests(tsTasks.tsDestPath));

  // Run api tests
  gulp.task('test:api', ['pre-test'], testTasks.runApiTests(tsTasks.tsDestPath));

  /**
   * Watch files under src/ for mods, lint and recompile them (incrementally)
   */
  gulp.task('watch', tsTasks.watch(gulp, 'transpile:clean:false'));

  /**
   * Start server in dev mode. The code will be incrementally linted, compiled
   * and the server restarted uppon changes to the source files
   */
  gulp.task('dev', ['transpile:clean:true'], processMonitTasks.runDeamon(tsTasks.tsSrcPath));

  /**
   * Default task.  Will execute tslint on all files first.
   */
  gulp.task('default', ['lint', 'watch']);

  /**
   * GIT pre-push hook.  We're only linting at the moment
   */
  gulp.task('pre-push', ['lint']);

  // Run all test types
  gulp.task('test', _.keys(gulp.tasks).filter((taskName) => /test:/.test(taskName)));

  return gulp;
}

module.exports = {
  bindBaseTasks,
};
