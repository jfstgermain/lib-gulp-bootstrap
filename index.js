const tsTasks           = require('./tasks/typescript-tasks');
const processMonitTasks = require('./tasks/process-monit-tasks');
const testTasks         = require('./tasks/test-tasks');
const guppy             = require('git-guppy');
const releaseFlows      = require('gulp-release-flows');
const _                 = require('lodash');
let runSequence         = require('run-sequence');

function bindBaseTasks (gulp) {
  const guppyInstance = guppy(gulp);

  runSequence = runSequence.use(gulp);
  // Add release flows' module tasks
  releaseFlows(gulp);

  /**
   * Lint all custom TypeScript files.
   */
  gulp.task('lint', tsTasks.lint);

  /**
   * Deletes the `dist/` directory
   */
  gulp.task('test:clean', testTasks.clean);

  /**
   * Deletes the `coverage/` and `reports/` directories
   */
  gulp.task('typescript:clean', tsTasks.clean);

  /**
  * Remove all generated JavaScript files from TypeScript compilation.
  */
  gulp.task('clean', ['test:clean', 'typescript:clean']);

  /**
   * Compile TypeScript and include references to library and app .d.ts files.
   */
  gulp.task('transpile:clean:false', ['lint'], tsTasks.transpile);

  gulp.task('transpile:clean:true', ['lint', 'typescript:clean'], tsTasks.transpile);

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

  gulp.task('test', function () {
    const testTasks = _.keys(gulp.tasks).filter((taskName) => /test:/.test(taskName));
    return gulp.start(testTasks);
  });

  // Run all test types
  // gulp.task('test', function (cb) {
  //   // TODO: this invokes the `pre-test` task for each test type.
  //   // refactor so `pre-test` is only executed once at the begining
  //   // when invoking `gulp test`
  //   const testTasks = _.keys(gulp.tasks).filter((taskName) => /test:/.test(taskName));
  //
  //   // Run in sequnce, otherwise the console output is all interwined between tasks
  //   runSequence(...testTasks, cb);
  // });

  return gulp;
}

module.exports = {
  bindBaseTasks,
};
