const tsTasks           = require('./tasks/typescript-tasks');
const processMonitTasks = require('./tasks/process-monit-tasks');
const testTasks         = require('./tasks/test-tasks');
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

  // Run all test types
  // NOTE: the `transpile` task needs to be added here to ensure it is
  // ran first in `test:unit`
  gulp.task('test', ['test:unit', 'test:api']);

  /**
   * Watch files under src/ for mods, lint and recompile them (incrementally)
   */
  gulp.task('watch', tsTasks.watch(gulp, 'transpile:clean:false'));

  /**
   * Start server in dev mode. The code will be incrementally linted, compiled
   * and the server restarted uppon changes to the source files
   */
  gulp.task('dev', processMonitTasks.runDeamon(tsTasks.tsSrcPath));

  /**
   * Default task.  Will execute tslint on all files first.
   */
  gulp.task('default', ['lint', 'watch']);

  /**
   * GIT pre-commit hook.  We're only linting at the moment
   */
  gulp.task('pre-commit', ['lint']);

  return gulp;
}

module.exports = {
  bindBaseTasks,
};
