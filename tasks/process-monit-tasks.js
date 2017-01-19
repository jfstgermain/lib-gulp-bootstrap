const path    = require('path');
const nodemon = require('gulp-nodemon');
const fs      = require('fs');
const spawn   = require('child_process').spawn;
const _       = require('lodash');
let args      = require('yargs').argv;

// eslint-disable-next-line import/no-dynamic-require
const appPackageConfig = require(`${process.cwd()}/package.json`);
const indexFilePath    = path.join(process.cwd(), appPackageConfig.main);

function runDeamon (srcPath) {
  return () => {
    let bunyan = null;

    if (appPackageConfig.main && fs.existsSync(indexFilePath)) {
      nodemon({
        script: indexFilePath,
        watch: [`${srcPath}/`],
        ext: 'ts',
        env: {
          NODE_ENV: 'development',
        },
        tasks: ['transpile:clean:false'],
        stdout: false,
      })
      .on('readable', function () {
        if (bunyan) {
          bunyan.kill();
        }

        if (_.isEmpty(args)) {
          // default bunyan cli args is none are passed.
          // TODO: filter on bunyan args only (could be identified with a `--bunyan` flag)
          args = ['--output', 'simple'];
        }
        // Pass output through bunyan formatter
        bunyan = spawn(
          path.join(process.cwd(), 'node_modules', 'bunyan', 'bin', 'bunyan'),
          args
        );

        bunyan.stdout.pipe(process.stdout);
        bunyan.stderr.pipe(process.stderr);
        this.stdout.pipe(bunyan.stdin);
        this.stderr.pipe(bunyan.stdin);
      });
    } else {
      throw new Error(`Please configure the 'main' field in package.json so it
                       points to your application exectution entry point
                       eg: '"main": "dist/index.js"'`);
    }
  };
}

module.exports = {
  runDeamon,
};
