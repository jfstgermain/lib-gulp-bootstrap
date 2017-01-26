const _ = require('lodash');

function runParallel (runSequence, tasks, cb) {
  if (!_.isEmpty(tasks)) {
    // note that tasks are in an array, thus ran in parallel
    // see https://www.npmjs.com/package/run-sequence
    runSequence(tasks, cb);
  } else {
    cb();
  }
}

function preTranspile(gulp, runSequence) {
  return (cb) => {
    const preTranspileTasks = _.keys(gulp.tasks).filter((taskName) => /build:pre-transpile:/.test(taskName));
    runParallel(runSequence, preTranspileTasks, cb);
  }
}

function postTranspile(gulp, runSequence) {
  return (cb) => {
    const postTranspileTasks = _.keys(gulp.tasks).filter((taskName) => /build:post-transpile:/.test(taskName));
    runParallel(runSequence, postTranspileTasks, cb);
  }
}

module.exports = {
  preTranspile,
  postTranspile,
};
