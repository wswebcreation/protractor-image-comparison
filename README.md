protractor-image-comparison
==========

[![dependencies Status](https://david-dm.org/wswebcreation/protractor-image-comparison/status.svg)](https://david-dm.org/wswebcreation/protractor-image-comparison) [![Build Status](https://travis-ci.org/wswebcreation/protractor-image-comparison.svg?branch=master)](https://travis-ci.org/wswebcreation/protractor-image-comparison) [![Sauce Test Status](https://saucelabs.com/buildstatus/wswebcreation-nl)](https://saucelabs.com/u/wswebcreation-nl)

[![NPM](https://nodei.co/npm/protractor-image-comparison.png)](https://nodei.co/npm/protractor-image-comparison/)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/wswebcreation-nl.svg)](https://saucelabs.com/u/wswebcreation-nl)

##What can it do?
*protractor-image-comparison* is a lightweight *protractor* plugin for browsers / mobile browsers / hybrid apps to do image comparison on screens or elements.

You can:

- save or compare screens / elements against a baseline
- **NEW:** save or compare a fullpage screenshot against a baseline (**only browsers are currently supported**)
- **NEW:** disbale css animations by default
- blockout custom regions during comparison (all)
- increase the element dimenisions screenshots (all)
- provide custom iOS and Android offsets for status-/address-/toolbar (mobile only)
- automatically exclude a statusbar during screencomparison (mobile only)
- **NEW** ignore anti-aliasing differences
- **NEW** compare images by ignoring their colors (do a grayscale comparison)

Comparison is based on [ResembleJS](https://github.com/Huddle/Resemble.js).

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
*protractor-image-comparison* can be used for:

- desktop browsers (Chrome / Firefox / Safari / Internet Explorer 11 / Microsoft Edge)
- mobile / tablet browsers (Chrome / Safari on emulators / real devices) via Appium
- Hybrid apps via Appium

For more information about mobile testing see the [Appium](./docs/appium.md) documentation. 

*protractor-image-comparison* provides:

- two comparison methods `checkScreen` and `checkElement`.
- two helper methods `saveScreen` and `saveElement` for saving images.
- **NEW** two helper methods `saveFullPageScreens` and `checkFullPageScreen` for saving a fullpage screenshot.

The comparison methods return a result in percentages like `0` or `3.94`.
*protractor-image-comparison* can work with Jasmine and Cucumber.js. See [Examples](./docs/examples.md) for or a *protractor*-config setup, or a Jasmine or a CucumberJS implementation.

More information about the **methods** can be found [here](./docs/methods.md).

## Conventions
See [conventions.md](./docs/conventions.md).

## Contribution
See [CONTRIBUTING.md](./docs/CONTRIBUTING.md).

## Credits
- Basic logic of `index.js` based on [PixDiff](https://github.com/koola/pix-diff)
- Comparison core of `./lib/resemble.js` [node-resemble](https://github.com/lksv/node-resemble.js) + [ResembleJS](https://github.com/Huddle/Resemble.js)

## TODO
* Update documentation for Mobile
* Update tests
* New (mobile friendly) testpage
* Add `debug` method
* Add `clean` method to clean the given `screenshotPath` before running