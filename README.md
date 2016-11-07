protractor-image-comparison
==========

A lightweight protractor plugin for image comparison.

[![dependencies Status](https://david-dm.org/wswebcreation/protractor-image-comparison/status.svg)](https://david-dm.org/wswebcreation/protractor-image-comparison) [![Build Status](https://travis-ci.org/wswebcreation/protractor-image-comparison.svg?branch=master)](https://travis-ci.org/wswebcreation/protractor-image-comparison) [![Sauce Test Status](https://saucelabs.com/buildstatus/wswebcreation-nl)](https://saucelabs.com/u/wswebcreation-nl)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/wswebcreation-nl.svg)](https://saucelabs.com/u/wswebcreation-nl)

##Installation
**!!NPM MODULE IS NOT CREATED YET!!**

Install this module locally with the following command:
```shell
npm install protractor-image-comparison
```

Save to dependencies or dev-dependencies:
```shell
npm install --save protractor-image-comparison
npm install --save-dev protractor-image-comparison
```

##Usage
protractor-image-comparison can be used for:

- desktop browsers (Chrome / Firefox / Safari / Internet Explorer 11 / Microsoft Edge)
- mobile / tablet browsers (Chrome / Safari on emulators / real devices) based on Appium

For more information about mobile testing see the [Appium](./docs/appium.md) documentation. 

Image Comparison provides:

- two comparison methods `checkScreen` and `checkElement`.
- two helper methods `saveScreen` and `saveElement` for saving images.

The comparison methods return a result in percentages like `0` or `3.94`.
Image Comparison can work with Jasmine and Cucumber.js. See [Examples](./docs/examples.md) for the Jasmine and CucumberJS implementation.

###saveScreen or checkScreen 
The methods `saveScreen` and `checkScreen` create a screenshot of the visible viewport. Be aware that there are different webdriver implementations in creating complete screenshots.
For example:

- **screenshot of visible viewport:**
    - Chrome
    - Safari
    - Firefox when geckodriver is used (as of version 48 and higher)
    - Microsoft Edge
- **screenshots of complete page**
    - Firefox when firefoxdriver is used (verion 47 and lower)
    - Internet Explorer (11 and lower)

###saveElement or checkElement 
Images are cropped from the complete screenshot by using the `saveElement` or `checkElement` function. 
The method will calculate the correct dimensions based upon the webdriver element selector.

###Image Comparison Parameters:

* `baselineFolder` Defines the path to the reference images that are to be compared.
* `screenshotPath` Defines the path to where the "actual" captured images need to be saved.
* `nativeWebScreenshot` Image Comparison needs to calculate element position based on a native device screenshot(default: false), see the [Appium docs](./docs/appium.md) for more info.

###Function options:

* `blockOut` Object or list of objects with coordinates that should be blocked before comparing. (default: none). Keep in mind that the devicepixelratio on a browser / device influences the coordinates needed to create the blockout.
* `debug` When set, then block-out regions will be shown on the output image. (default: false)

####Block-Out
Sometimes, it is necessary to block-out some specific areas in an image that should be ignored for comparisons. For example, this can be IDs or even time-labels that change with the time. Adding block-outs to images may decrease false positives and therefore stabilizes these comparisons (see the [examples](./docs/examples.md)).

## Conventions
There are directory and naming conventions that must be met.

**Directory structure**
```text
path
└── to
    └── screenshots
        ├── diff
        │   └── examplePage-chrome-1280x1024.png
        ├── examplePage-chrome-800x600.png
        ├── examplePage-chrome-1280x1024.png
        ├── examplePageTitle-chrome-800x600.png
        └── examplePageTitle-chrome-1280x1024.png
```
The `baselineFolder` directory must contain all the *approved* images. You may create subdirectories for better organisation, but the relative path should then be given in the test spec method. Failed comparisons generate a diff image under the **diff** folder.

##Tests
There are several test that need to be executed to be able to test the module:

### Local
- `npm t` or `npm t -- -e local`: Run all tests on a local machine on Chrome and Firefox (job uses direct connect, first run `npm run wd-update` to update the webdriver. This needs to be done once after install)

### local on Appium
**First make sure Appium v 1.5.3 or higher is installed**

- `npm t -- -e android.adb`: Run all tests with Appium on an Android emulator with the ADB driver on Chrome (`appium --port 4728 --avd AVD_for_Nexus_5_by_Google`)
- `npm t -- -e android.chromedriver`: Run all tests with Appium on an Android emulator with the ChromeDriver on Chrome (`appium --port 4727 --avd AVD_for_Nexus_5_by_Google`)
- `npm t -- -e ios.simulator`: Run all tests with Appium on Apple iOS simulator on Safari (`appium --port 4726`)

### Travis-ci with Sauce Labs
- `npm t -- -e saucelabs`: This command is used to test the build through [Travis-ci](https://travis-ci.org/wswebcreation/protractor-image-comparison/). It will test against a lot of configurations that can be found [here](./test/conf/protractor.saucelabs.conf.js)

### Perfecto (cloud services for real devices)
**Make sure you have an account and create a `perfecto.config.json` file in the root of this project with a `user`, a `password`- and a `seleniumAddress` key! like this:**

`````
{
  "password": "password",
  "user": "username",
  "seleniumAddress": "https://yourcloud.perfectomobile.com/nexperience/perfectomobile/wd/hub/"
}
`````

- `npm t -- -e perfecto.android`: Run all tests on a real Android device on Chrome in the cloud (credentials are needed to be able to test this)
- `npm t -- -e perfecto.ios`: Run all tests on a real Apple iOS device on Safari in the cloud (credentials are needed to be able to test this)

## Credits
- Basic logic of `index.js` based on [PixDiff](https://github.com/koola/pix-diff)
- Comparison core of `./lib/resemble.js` [node-resemble](https://github.com/lksv/node-resemble.js) + [ResembleJS](https://github.com/Huddle/Resemble.js)