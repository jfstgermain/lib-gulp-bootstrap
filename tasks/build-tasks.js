const _ = require('lodash');

function preTranspile() {
  const preTranspileTasks = _.keys(gulp.tasks).filter((taskName) => /build:pre-transpile:/.test(taskName));
  return gulp.start(preTranspileTasks);
}

function postTranspile() {
  const postTranspileTasks = _.keys(gulp.tasks).filter((taskName) => /build:post-transpile:/.test(taskName));
  return gulp.start(postTranspileTasks);
}

module.exports = {
  preTranspile,
  postTranspile,
};
