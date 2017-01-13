const tsTasks           = require('./tasks/typescript-tasks');
const processMonitTasks = require('./tasks/process-monit-tasks');
const testTasks         = require('./tasks/test-tasks');
const gulpSequence      = require('gulp-sequence');
const guppy             = require('git-guppy');

function bindBaseTasks (gulp) {
  const guppyInstance = guppy(gulp);
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
  gulp.task('transpile', ['lint', 'clean'], tsTasks.transpile);


  // [Test related tasks]
  // Instrument code for coverage
  gulp.task('pre-test', testTasks.preTest(tsTasks.tsDestPath));

  // Run unit tests
  gulp.task('test:unit', gulpSequence('transpile', 'pre-test'), testTasks.runUnitTests(tsTasks.tsDestPath));

  // Run all test types
  gulp.task('test', ['test:unit']);

  /**
   * Watch files under src/ for mods, lint and recompile them (incrementally)
   */
  gulp.task('watch', tsTasks.watch(gulp, 'transpile'));

  /**
   * Start server in dev mode. The code will be incrementally linted, compiled
   * and the server restarted uppon changes to the source files
   */
  gulp.task('dev', ['transpile'], processMonitTasks.runDeamon);

  /**
   * Default task.  Will execute tslint on all files first.
   */
  gulp.task('default', gulpSequence('lint', 'watch'));

  /**
   * GIT pre-commit hook.  We're only linting at the moment
   */
  gulp.task('pre-commit', ['lint']);

  return gulp;
}

module.exports = {
  bindBaseTasks,
};
