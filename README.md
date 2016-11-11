protractor-image-comparison
==========

A lightweight protractor plugin for image comparison.

[![dependencies Status](https://david-dm.org/wswebcreation/protractor-image-comparison/status.svg)](https://david-dm.org/wswebcreation/protractor-image-comparison) [![Build Status](https://travis-ci.org/wswebcreation/protractor-image-comparison.svg?branch=master)](https://travis-ci.org/wswebcreation/protractor-image-comparison) [![Sauce Test Status](https://saucelabs.com/buildstatus/wswebcreation-nl)](https://saucelabs.com/u/wswebcreation-nl)

[![NPM](https://nodei.co/npm/protractor-image-comparison.png)](https://nodei.co/npm/protractor-image-comparison/)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/wswebcreation-nl.svg)](https://saucelabs.com/u/wswebcreation-nl)

##Installation
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

*protractor-image-comparison* provides:

- two comparison methods `checkScreen` and `checkElement`.
- two helper methods `saveScreen` and `saveElement` for saving images.

The comparison methods return a result in percentages like `0` or `3.94`.
*protractor-image-comparison* can work with Jasmine and Cucumber.js. See [Examples](./docs/examples.md) for the Jasmine and CucumberJS implementation.

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

###protractor-image-comparison Parameters:

* `baselineFolder` Defines the path to the reference images that are to be compared.
* `screenshotPath` Defines the path to where the "actual" captured images need to be saved.
* `formatImageName` Naming format for images (default: `{tag}-{browserName}-{width}x{height}`), see **Conventions: image naming** for more info
* `nativeWebScreenshot` *protractor-image-comparison* needs to calculate element position based on a native device screenshot(default: false), see the [Appium docs](./docs/appium.md) for more info.
* `blockOutStatusBar` *protractor-image-comparison* can blockout the statusbar of a device by default when comparion screens. This means that for example the time in the statusbar won't cause a failure (default:false)
* `androidOffsets` An object that will hold the pixels of the `statusBar`, `addressBar` and or the `toolBar`. The values are used to calculate the position of an element on a screen (for `saveElement` or `checkElement`). They are defaulted, but can be overridden. These values can be different per Android version. Look up the docs for developing for Android to see the values. If not provided the defaults will be used.
* `iosOffsets` An object that will hold the pixels of the `statusBar` and or the `addressBar`. The values are used to calculate the position of an element on a screen (for `saveElement` or `checkElement`). They are defaulted, but can be overridden. These values can be different per iOS version. Look up the docs for developing for iOS to see the values. If not provided the defaults will be used.

**For example:**

`````
browser.protractorImageComparison = new protractorImageComparison({
	baselineFolder: './baseline/',
	screenshotPath: './.tmp/',
	nativeWebScreenshot: true,
	blockOutStatusBar: true,
	androidOffsets: {
		statusBar: 50,
		addressBar: 100,
		toolBar: 60
	},
   iosOffsets: {
		statusBar: 40,
		addressBar: 100
	}
});
`````

###Method options:
#### blockOut
Sometimes, it is necessary to block-out some specific areas in an image that should be ignored for comparisons. For example, this can be IDs or even time-labels that change with the time. Adding block-outs to images may decrease false positives and therefore stabilizes these comparisons (see the [examples](./docs/examples.md)). 
It can be used for `checkElement` and `checkScreen` and is an object or list of objects with coordinates that should be blocked before comparing. (default: none).

**Keep in mind that the devicepixelratio on a browser / device influences the coordinates needed to create the blockout. Calculate the blockouts based on a screenshot (of an element) that already has been created, use for example Photoshop for this.** 

#### resizeDimensions
Sometimes it is needed that the cut of an image should be bigger then the element itself. Take for example the hover state. A kind of a box / halo can be presented around the element that is not placed within but outside the element. With `resizeDimensions` the size of the cut of the element image can be made bigger. `resizeDimensions` accepts an integer and the value need to represent pixels. Calculation against the devicepixelratio will be done by `protractor-image-comparison`
For example:

`````
expect(browser.imageComparson.saveElement(element(by.css('#id')), 'tagName', {resizeDimensions: 15})).toEqual(0);
// or
expect(browser.imageComparson.checkElement(element(by.css('#id')), 'tagName', {resizeDimensions: 15})).toEqual(0);
`````


## Conventions
There are directory and naming conventions that must be met.

###Directory structure**
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

### image naming
Images should obey the following default format:

`````
{descriptionInCamelCase}-{browserName}-{browserWidth}x{browserHeight}.png
`````

The naming convention can be customized by passing the parameter `formatString` with a format string like:

`````
{browserName}_{tag}__{width}-{height}
`````

The following variables can be passed to format the string
* `browserName` The browser name property from the capabilities
* `deviceName` The deviceName from capabilities
* `dpr` The device pixel ratio
* `logName` The logName from capabilities
* `mobile` This will add `_app`, of `browserName` after the deviceName to distingues app screenshots from browser screenshots
* `name` The name from capabilities

Images specified via name in the spec method will be selected according to the browsers current resolution. That is to say that multiple images can share the same name differentated by resolution.

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

## TODO
* Update documentation for Mobile and different webdriver implementation
* Update tests
* New (mobile friendly) testpage
* Add `debug` method
* Add `clean` method to clean the given `screenshotPath` before running