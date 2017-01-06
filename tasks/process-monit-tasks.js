const path    = require('path');
const nodemon = require('gulp-nodemon');
const fs      = require('fs');

// eslint-disable-next-line import/no-dynamic-require
const appPackageConfig = require(`${process.cwd()}/package.json`);
const indexFilePath    = path.join(process.cwd(), appPackageConfig.main);

function runDeamon () {
  if (appPackageConfig.main && fs.existsSync(indexFilePath)) {
    nodemon({
      script: indexFilePath,
      ext: 'js',
      env: {
        NODE_ENV: 'development',
      },
      watch: ['dist/'],
    })
    .on('start', ['watch'])
    .on('change', ['watch'])
    .on('restart', () => {
      console.log('Process restarted');
    });
  } else {
    throw new Error(`Please configure the 'main' field in package.json so it
                     points to your application exectution entry point
                     eg: '"main": "dist/index.js"'`);
  }
}

module.exports = {
  runDeamon,
};
