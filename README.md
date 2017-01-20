# Using this module in other modules

Your project `gulpfile.js` should initially look like this:

```js
const gulp          = require('gulp');
const gulpBootstrap = require("lib-gulp-bootstrap");

gulpBootstrap.bindBaseTasks(gulp);

```

For the moment, the sources directory is expected to be `/src`.  The transpiled code (including tests) will be outputted to `/dist`. If need be, this could be configurable eventually.

Make sure the `main` entry in `package.json` points to the execution entry point of the app eg:
`"main": "dist/lib/index.js"`.  See the `dev` task description below.

### Gulp tasks provided by the module
1. `gulp lint`: runs the typescript linter
2. `gulp clean`: clears the `/dist` directory
3. `gulp transpile`: transpiles typescript sources to javascript to `/dist`
4. `gulp test`: executes transpiled tests under `/dist/test`.  Note that unit tests are expected to be under `/src/test/unit`

   In order to output `xunit` type reports, run the test command as follows: `gulp test --reporter xunit --reporter-output <a test report local file>.xml`
5. `gulp watch`: monitors changes to files in the `/src` directory and runs the linter on changed files
6. `gulp dev`: runs the linter and transpiles sources uppon changes and restarts the application for which the execution entry point is configured under `main` in the `package.json`

   `bunyan` [options](https://github.com/trentm/node-bunyan#cli-usage) can also be passed in eg: `gulp dev -l warn -c 'this.service_name == "service_vmtl"'`
7. `gulp build:<sub-task>`: useful tasks for tagging versions of a module. see external module [documentation](https://github.com/indexiatech/gulp-release-flows)

(Gulp Recipies)[https://github.com/gulpjs/gulp/tree/master/docs/recipes]
