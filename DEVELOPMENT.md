# Development instructions

### Running development server and watches

The project contains a small demo stylesheet that can be used to develop the UI.
Start watching UI code changes in lib/app and build the app using the demo stylesheets:

    gulp dev

Running the task also runs a small development server, and does the same as:

    gulp watch --source ./lib/app --output ./demo-output --config ./lib/app/styleguide_config.json

### Running tests

Run all the tests and JSCS linting with

    npm test

Node module tests are ran with Mocha, UI related tests with Karma & PhantomJS.

### Coding convention

This project follows AirBNB-ish JavaScript coding convention (with a few changes). It is tuned to use [JSCS]() as a code
checker. The checking is injected into the testing process, so you can see in Travis respond to your pull-request if your
files follow the convention.

To be able to check during development, please

* run `$ gulp jscs`
* use [JSCS editor plugins](https://github.com/jscs-dev/node-jscs#friendly-packages)
* use [pre-commit hook](https://github.com/SC5/sc5-configurations/tree/master/.githooks/pre-commit)

## How to release

1. Check that all the needed pull requests are merged
1. Make sure that your clone fetched all the tags which exist in the SC5 repo
1. Rebase your `master` branch against SC5
1. Create `release/x.y.z` branch with the number of upcoming version and switch to it
1. Increment the package number in `package.json`
1. Run `gulp publish`
1. Check the `CHANGELOG.md` file. You can remove not needed items or rename them.
1. Commit changes
1. Make a pull request from your feature branch
1. Once your pull request is merged, rebase your `master` against SC5 again
1. Run `npm publish`
1. Create a versioning tag in GitHub. Insert the `CHANGELOG.md` content as a description of this versioning tag.
