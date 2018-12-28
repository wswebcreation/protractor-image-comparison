Contributing
============

## Questions
Please first read through the [FAQ](../README.md#faq). If that doesn't answer your question you can file an issue, see [issues](./CONTRIBUTING.md#issues).

## Issues
If you have a questions, bug or feature request, please file an issue. Before submitting an issue, please search the issue archive to help reduce duplicates, and read the [FAQ](../README.md#faq).
If you can't find it there you can submit an issue where you can submit:

- \U0001F41B**Bug report**: Create a report to help us improve
- \U0001F4D6**Documentation**: Suggest improvements or report missing/unclear documentation.
- \U0001F4A1**Feature request**: Suggest an idea for this module.
- \U0001F4AC**Question**: Ask questions.

Contributing to Source Code (Pull Requests)
===========================================
In order to create a PR for this project and start contributing follow this step by step guide:

* Fork the project.
* Clone the project somewhere on your computer

    ```
    $ git clone https://github.com/wswebcreation/protractor-image-comparison.git
    ```
    
* Go to the directory and setup the project
		
		```
		$ cd protractor-image-comparison
		$ npm install
		```

* This project is written in TypeScript, so first run the watch mode that will automatically transpile the code
		
		```
		$ npm run watch
		```

* And create the new feature / fix a bug

## Tests
There are several test that need to be executed to be able to test the module. When adding a PR all tests must at least pass the local tests.
Each PR is automatically tested against Sauce Labs, see [Travis-ci with Sauce Labs](./CONTRIBUTING.md#travis-ci-with-sauce-labs-not-needed-for-a-pr).
Before approving a PR the core contributers will test the PR against emulators / simulators / real devices.

### Local
**Make sure a local webdriver is installed, see [How to run a local webdriver](./CONTRIBUTING.md#how-to-run-a-local-webdriver) and start your webdriver.**
(*DirectConnect from protractor itself is not stable enough to run our tests, that's why we we use a local webdriver*).

First a local baseline needs to be created. This can be done with 

```
$ npm run test.init
```
		
This command will create a folder called `localBaseline` that will hold all the baseline images.

Then run 

```
npm run test.local.desktop
``` 

This will run all tests on a local machine on Chrome and Chrome Headless.

##### How to run a local webdriver
If you never installed a local webdriver, follow steps 1 and 2, else start the webdriver with step 3

1. install a local webdriver with 
	```
	$ npm install webdriver-manager -g
	```
2. then download all the webdrivers
	```
	$ webdriver-manager update
	```
3. then start the webdriver on `localhost:4444` with this
	```
	$ webdriver-manager start
	```

## Travis-ci with Sauce Labs (not needed for a PR)
The command below is used to test the build on [Travis-ci](https://travis-ci.org/wswebcreation/protractor-image-comparison/), it can only be used there and not for local development.

```
$ npm run test.saucelabs
```

It will test against a lot of configurations that can be found [here](./test/conf/protractor.saucelabs.conf.js).

All PR's are automatically checked against Sauce Labs.
