const _ = require('lodash');

function preTranspile(gulp) {
  return () => {
    const preTranspileTasks = _.keys(gulp.tasks).filter((taskName) => /build:pre-transpile:/.test(taskName));
    return gulp.start(preTranspileTasks);
  }
}

function postTranspile(gulp) {
  return () => {
    const postTranspileTasks = _.keys(gulp.tasks).filter((taskName) => /build:post-transpile:/.test(taskName));
    return gulp.start(postTranspileTasks);
  }
}

module.exports = {
  preTranspile,
  postTranspile,
};
