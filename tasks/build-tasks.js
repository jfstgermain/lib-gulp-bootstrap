const _ = require('lodash');

let gulp;
let runSequence;

// gup-release-flows uses the `build:` prefix for their tasks (it should
// ne `release:` but ¯\_(ツ)_/¯ )
const excludedBuildTasks = [
  'build:release',
  'build:bump-version',
  'build:changelog',
  'build:commit-changes',
  'build:push-changes',
  'build:create-new-tag'
];

function runParallel (runSequence, tasks, cb) {
  if (!_.isEmpty(tasks)) {
    // note that tasks are in an array, thus ran in parallel
    // see https://www.npmjs.com/package/run-sequence
    runSequence(tasks, cb);
  } else {
    cb();
  }
}

function filterTasks (tasks, prefixRegEx) {
  return _.keys(tasks).filter((taskName) =>  {
    return prefixRegEx.test(taskName) && !_.include(excludedBuildTasks, taskName);
  });
}

function preTranspile (cb) {
  const preTranspileTasks = filterTasks(gulp.tasks, /build:pre-transpile:/);
  runParallel(runSequence, preTranspileTasks, cb);
}

function postTranspile(cb) {
  const postTranspileTasks = filterTasks(gulp.tasks, /build:post-transpile:/);
  runParallel(runSequence, postTranspileTasks, cb);
}

module.exports = function (_gulp, _runSequence) {
  gulp = _gulp;
  runSequence = _runSequence;

  return {
    preTranspile,
    postTranspile,
  }
};
