protractor-image-comparison
==========

[![Join the chat at https://gitter.im/wswebcreation/protractor-image-comparison](https://badges.gitter.im/wswebcreation/protractor-image-comparison.svg)](https://gitter.im/wswebcreation/protractor-image-comparison?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![dependencies Status](https://david-dm.org/wswebcreation/protractor-image-comparison/status.svg)](https://david-dm.org/wswebcreation/protractor-image-comparison) [![Build Status](https://travis-ci.org/wswebcreation/protractor-image-comparison.svg?branch=master)](https://travis-ci.org/wswebcreation/protractor-image-comparison) [![Sauce Test Status](https://saucelabs.com/buildstatus/wswebcreation-nl)](https://saucelabs.com/u/wswebcreation-nl)

[![NPM](https://nodei.co/npm/protractor-image-comparison.png)](https://nodei.co/npm/protractor-image-comparison/)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/wswebcreation-nl.svg)](https://saucelabs.com/u/wswebcreation-nl)

> **I'M CURRENTLY REFACTORING THE MODULE, FOR MORE INFO SEE ISSUE [83](https://github.com/wswebcreation/protractor-image-comparison/issues/83)**

## What can it do?
*protractor-image-comparison* is a lightweight *protractor* plugin for browsers / mobile browsers / hybrid apps to do image comparison on screens or elements.

You can:

- save or compare screens / elements against a baseline
- save or compare a fullpage screenshot against a baseline (**desktop AND mobile are now supported**)
- automatically create a baseline when no baseline is there
- disable css animations by default
- ignore anti-aliasing differences
- compare images by ignoring their colors (do a grayscale comparison)
- blockout custom regions during comparison (all)
- ignore regions by making them transparent in the base image (all) thanks to [tharders](https://github.com/tharders)
- parameter to hide / show scrollbars [pnad](https://github.com/pnad)
- increase the element dimenisions screenshots (all)
- provide custom iOS and Android offsets for status-/address-/toolbar (mobile only)
- automatically exclude a statusbar during screencomparison (mobile only)
- taking a screenshot directly from canvas, tnx to [tuomas2](https://github.com/tuomas2), see [here](https://github.com/wswebcreation/protractor-image-comparison/blob/master/docs/index.md#saveelementelement-tag-options--promise). **!!This isn't supported in IE11 and Safari 9!!**
- use a tolerance property called `saveAboveTolerance` that prevents saving result image to diff folder, tnx to [IgorSasovets](https://github.com/IgorSasovets )**
- **NEW**, more accurate comparison with 2 new methods called `ignoreLess` and `ignoreNothing`. These 2 methods compare with different `red, green, blue, alpha, minBrightness and maxBrightness`
- **NEW**, more accurate percentage. In previous releases the mismatch was with max with 2 digits. With `rawMisMatchPercentage:true`, you can have a result like `0.69803221`

Comparison is based on [ResembleJS](https://github.com/Huddle/Resemble.js). If you want to compare images online you can check the [online tool](https://huddleeng.github.io/Resemble.js/)

## Installation
Install this module locally with the following command:

```shell
npm install protractor-image-comparison
```

Save to dependencies or dev-dependencies:

```shell
npm install --save protractor-image-comparison
npm install --save-dev protractor-image-comparison
```

## Usage
*protractor-image-comparison* can be used for:

- desktop browsers (Chrome / Firefox / Safari / Internet Explorer 11 / Microsoft Edge)
- mobile / tablet browsers (Chrome / Safari on emulators / real devices) via Appium
- Hybrid apps via Appium

For more information about mobile testing see the [Appium](./docs/appium.md) documentation.

### Load from the configuration file of *protractor*

You can load `protractor-image-comparison` form the config like below

```js
exports.config = {
   // your config here ...

    onPrepare: function() {
        const protractorImageComparison = require('protractor-image-comparison');
        browser.protractorImageComparison = new protractorImageComparison(
            {
                baselineFolder: 'path/to/baseline/',
                screenshotPath: 'path/to/save/actual/screenshots/'
            }
        );
    },
}
```

The full list of options can be found [here](./docs/index.md#new-protractorimagecomparisonoptions)

> **NOTE: You don't need to run AND `saveElement|saveScreen|saveFullPageScreens` if you want to run `checkElement|checkScreen|checkFullPageScreen`**

If you run for the first time without having a baseline the `check`-methods will reject the promise with the following warning:

    `Image not found, saving current image as new baseline.`

This means that the current screenshot is saved in the actual folder and you **manually need to copy it to your baseline**.
If you instantiate `protractor-image-comparsion` with `autoSaveBaseline: true`, see [docs](./docs/index.md#new-protractorimagecomparisonoptions),
the image will automatically be saved into the baselinefolder.


*protractor-image-comparison* provides:

- two comparison methods `checkScreen` and `checkElement`.
- two helper methods `saveScreen` and `saveElement` for saving images.
- **NEW** a helper `saveFullPageScreens` and a comparison method `checkFullPageScreen` for saving and comparing a fullpage screenshot.

The comparison methods return a result in percentages like `0` or `3.94`, or when `rawMisMatchPercentage:true` it can return a percentage like `0.00244322` .

*protractor-image-comparison* can work with Jasmine, Mocha and Cucumber.js. See [Examples](./docs/examples.md) for or a Jasmine implementation.

More information about the **methods** can be found [here](./docs/methods.md).

## Ouput
To see example of the output please check [here](./docs/output.md)

## Conventions
See [conventions.md](./docs/conventions.md).

## Contribution
See [CONTRIBUTING.md](./docs/CONTRIBUTING.md).

## FAQ
### Width and height cannot be negative
It could be that the error `Width and height cannot be negative` is thrown. 9 out of 10 times this is related to creating an image of an element that is not in the view. Please be sure you always make sure the element in is in the view before you try to make an image of the element.

### Changing the color on an element is not detected by protractor-image-comparison
When using Chrome and using the `chromeOptions.args:['--disable-gpu']` it could be possible that the images can't be compared in the correct way. If you remove this argument all will work again. See [here](https://github.com/wswebcreation/protractor-image-comparison/issues/33#issuecomment-333409063)

## Credits
- Comparison core of `./lib/resemble.js` [ResembleJS](https://github.com/Huddle/Resemble.js)

## TODO
* Update documentation for Mobile
* New (mobile friendly) testpage
