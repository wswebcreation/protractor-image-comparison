Contributing
============

#Tests
There are several test that need to be executed to be able to test the module. When adding a PR all tests must at least pass the local tests.
Each PR is automatically tested against Sauce Labs, see [Travis-ci with Sauce Labs](#travis-ci-with-sauce-labs).
Before approving a PR the core contributers will test the PR against emulators / simulators / real devices.

## Local
**Make sure a local webdriver is installed, see [How to run a local webdriver](#how-to-run-a-local-webdriver) and start your webdriver.** 
(*DirectConnect from protractor itself is not stable enough to run our tests, that's why we we use a local webdriver*).

First a local baseline needs to be created. This can be done with `npm run test.init`. This command will create a folder called `localBaseline` that will hold all the baseline images.
Then run `npm run test.local`. This will run all tests on a local machine on Chrome (job uses direct connect, first run `npm run wd-update` to update the webdriver. 
This needs to be done once after install).

### How to run a local webdriver
If you never installed a local webdriver, follow steps 1 and 2, else start the webdriver with step 3

1. install a local webdriver with `npm install webdriver-manager -g`
2. then `webdriver-manager update` to download all the webdrivers
3. then `webdriver-manager start`, this will start a webdriver on `localhost:4444`

## Travis-ci with Sauce Labs
- `npm run test.ci`: This command is used to test the build through [Travis-ci](https://travis-ci.org/wswebcreation/protractor-image-comparison/). 
It will test against a lot of configurations that can be found [here](./test/conf/protractor.saucelabs.conf.js).

All PR's are automatically checked against SauceLabs.

## local on Appium (not needed for a PR)
**First make sure Appium v 1.5.3 or higher is installed**

- `npm run test.android.adb`: Run all tests with Appium on an Android emulator with the ADB driver on Chrome (`appium --port 4728 --avd AVD_for_Nexus_5_by_Google`)
- `npm run test.android.chromedriver`: Run all tests with Appium on an Android emulator with the ChromeDriver on Chrome (`appium --port 4727 --avd AVD_for_Nexus_5_by_Google`)
- `npm run test.ios.simulator`: Run all tests with Appium on Apple iOS simulator on Safari (`appium --port 4726`)

## Perfecto (cloud services for real devices, not needed for a PR)
**Make sure you have an account and create a `perfecto.config.json` file in the root of this project with a `user`, a `password`- and a `seleniumAddress` key! like this:**

`````
{
  "password": "password",
  "user": "username",
  "seleniumAddress": "https://yourcloud.perfectomobile.com/nexperience/perfectomobile/wd/hub/"
}
`````

`npm run test.perfecto`: Run all tests on a real:
 
 - Apple iOS device on Safari in the cloud
 - Samsung Android on Chrom in the cloud
 
**Credentials are needed to be able to test this**