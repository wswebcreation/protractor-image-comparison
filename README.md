protractor-image-comparison
==========

[![Join the chat at https://gitter.im/wswebcreation/protractor-image-comparison](https://badges.gitter.im/wswebcreation/protractor-image-comparison.svg)](https://gitter.im/wswebcreation/protractor-image-comparison?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![dependencies Status](https://david-dm.org/wswebcreation/protractor-image-comparison/status.svg)](https://david-dm.org/wswebcreation/protractor-image-comparison) [![Build Status](https://travis-ci.org/wswebcreation/protractor-image-comparison.svg?branch=master)](https://travis-ci.org/wswebcreation/protractor-image-comparison) [![Sauce Test Status](https://saucelabs.com/buildstatus/wswebcreation-nl)](https://saucelabs.com/u/wswebcreation-nl)

[![NPM](https://nodei.co/npm/protractor-image-comparison.png)](https://nodei.co/npm/protractor-image-comparison/)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/wswebcreation-nl.svg)](https://saucelabs.com/u/wswebcreation-nl)

> **NOTE:** V3 is out, please read the [releases](https://github.com/wswebcreation/protractor-image-comparison/releases) for all the (breaking)changes

## What can it do?
*protractor-image-comparison* is a lightweight *protractor* plugin for browsers / mobile browsers / hybrid apps to do image comparison on screens, elements or full page screens.

You can:

- save or compare screens / elements / full page screens against a baseline
- automatically create a baseline when no baseline is there
- blockout custom regions and even automatically exclude a status and or tool bars (mobile only) during a comparison
- hide / remove elements during comparison like for example stickyheaders (**NEW**)
- increase the element dimensions screenshots
- use different comparison methods
- and much more, see the [options here](./docs/OPTIONS.md)

The module is now based on the power of the new [`webdriver-image-comparison`](https://github.com/wswebcreation/webdriver-image-comparison) module. This is a lightweight module to retrieve the needed data and screenshots for all browsers / devices.
The comparison power comes from [ResembleJS](https://github.com/Huddle/Resemble.js). If you want to compare images online you can check the [online tool](https://huddleeng.github.io/Resemble.js/)


It can be used for:

- desktop browsers (Chrome / Firefox / Safari / Internet Explorer 11 / Microsoft Edge)
- mobile / tablet browsers (Chrome / Safari on emulators / real devices) via Appium
- Hybrid apps via Appium

> NOTE: See the browser-matrix at the [top](./README.md#protractor-image-comparison) of this readme to see all the supported browser/OS-versions.

## Installation
Install this module locally with the following command to be used as a (dev-)dependency:

```shell
npm install --save protractor-image-comparison
npm install --save-dev protractor-image-comparison
```

## Usage
> ***protractor-image-comparison* supports NodeJS 8 or higher** 

### Configuration
 
In comparison to **versions < 3** *protractor-image-comparison* can now be used as a plugin with the following code:

```typescript
// protractor.conf.js
const { join } = require('path');
exports.config = {
	// ... the rest of your config
	plugins: [
		{
			// The module name
			package: 'protractor-image-comparison',
			// Some options, see the docs for more
			options: {
				baselineFolder: join(process.cwd(), './baseline/'),
				formatImageName: `{tag}-{logName}-{width}x{height}`,
				screenshotPath: join(process.cwd(), '.tmp/'),
				savePerInstance: true,
				// ... more options
			},
		},
	],
};
```

More plugin options can be found [here](./docs/OPTIONS.md#plugin-options).

### Writing tests
*protractor-image-comparison* is framework agnostic, meaning that you can use it with all the frameworks Protractor supports like `Jasmine|Mocha|CucumberJS`. 
You can use it like this:

```typescript
import {$, browser} from 'protractor';

describe('protractor-image-comparison desktop', () => {
  beforeEach(async () => {
    await browser.get(browser.baseUrl);
  });
  
  it('should save some screenshots', async() => {
  	// Save a screen
  	await browser.imageComparison.saveScreen('examplePaged', { /* some options*/ });
  	
  	// Save an element
  	await browser.imageComparison.saveElement($('.uk-button:nth-child(1)'), 'firstButtonElement', { /* some options*/ });
  	
  	// Save a full page screens
  	await browser.imageComparison.saveFullPageScreen('fullPage', { /* some options*/ });
	});
  
  it('should compare successful with a baseline', async() => {
  	// Check a screen
  	expect(await browser.imageComparison.checkScreen('examplePaged', { /* some options*/ })).toEqual(0);
  	
  	// Check an element
  	expect(await browser.imageComparison.checkElement($('.uk-button:nth-child(1)'), 'firstButtonElement', { /* some options*/ })).toEqual(0);
  	
  	// Check a full page screens
  	expect(await browser.imageComparison.checkFullPageScreen('fullPage', { /* some options*/ })).toEqual(0);
	});
});
``` 

**If you run for the first time without having a baseline the `check`-methods will reject the promise with the following warning:**

```shell
#####################################################################################
 Baseline image not found, save the actual image manually to the baseline.
 The image can be found here:
 /Users/wswebcreation/Git/protractor-image-comparison/.tmp/actual/desktop_chrome/examplePage-chrome-latest-1366x768.png
 If you want the module to auto save a non existing image to the baseline you
 can provide 'autoSaveBaseline: true' to the options.
#####################################################################################

```

This means that the current screenshot is saved in the actual folder and you **manually need to copy it to your baseline**.
If you instantiate `protractor-image-comparsion` with `autoSaveBaseline: true` the image will automatically be saved into the baseline folder.

### Test result outputs
The `save(Screen/Element/FullPageScreen)` methods will provide the following information after the method has been executed:

```js
const saveResult = { 
	// The device pixel ratio of the instance that has run
  devicePixelRatio: 1,
  // The formatted filename, this depends on the options `formatImageName`
  fileName: 'examplePage-chrome-latest-1366x768.png',
  // The path where the actual screenshot file can be found
  path: '/Users/wswebcreation/Git/protractor-image-comparison/.tmp/actual/desktop_chrome',
};
```

See the [Check output on failure](./docs/OUTPUT.md#check-output-on-failure) section in the [output](./docs/OUTPUT.md) docs for the images.

By default the `check(Screen/Element/FullPageScreen)` methods will only provide a mismatch percentage like `1.23`, but when the plugin has the options `returnAllCompareData: true` the following information is provided after the method has been executed:

```js
const checkResult = {  
  // The formatted filename, this depends on the options `formatImageName`
  fileName: 'examplePage-chrome-headless-latest-1366x768.png',
  folders: {
      // The actual folder and the file name
      actual: '/Users/wswebcreation/Git/protractor-image-comparison/.tmp/actual/desktop_chrome/examplePage-chrome-headless-latest-1366x768.png',
      // The baseline folder and the file name
      baseline: '/Users/wswebcreation/Git/protractor-image-comparison/localBaseline/desktop_chrome/examplePage-chrome-headless-latest-1366x768.png',
      // This following folder is optional and only if there is a mismatch
      // The folder that holds the diffs and the file name
      diff: '/Users/wswebcreation/Git/protractor-image-comparison/.tmp/diff/desktop_chrome/examplePage-chrome-headless-latest-1366x768.png',
    },
    // The mismatch percentage
    misMatchPercentage: 2.34
};
```

See the [Save output](./docs/OUTPUT.md#save-output) section in the [output](./docs/OUTPUT.md) docs for the images.

## FAQ
### Do I need to use a `save(Screen/Element/FullPageScreen)` methods when I want to run `check(Screen/Element/FullPageScreen)`?
No, you don't need to do this. The `check(Screen/Element/FullPageScreen)` will do this automatically for you

### Width and height cannot be negative
It could be that the error `Width and height cannot be negative` is thrown. 9 out of 10 times this is related to creating an image of an element that is not in the view. Please be sure you always make sure the element in is in the view before you try to make an image of the element.

### Changing the color on an element is not detected by protractor-image-comparison
When using Chrome and using the `chromeOptions.args:['--disable-gpu']` it could be possible that the images can't be compared in the correct way. If you remove this argument all will work again. See [here](https://github.com/wswebcreation/protractor-image-comparison/issues/33#issuecomment-333409063)

## Contribution
See [CONTRIBUTING.md](./docs/CONTRIBUTING.md).

## TODO:
- [ ] iOS Safari on iPads can have multiple tabs, so the address bar is bigger making the cutout go wrong
- [ ] create a new website

## Credits
`protractor-image-comparison` uses an open source licence from Sauce Labs.
![Powered by Sauce LAbs](./docs/images/powered-by-saucelabs.png)

You can request your open source licence [here](https://saucelabs.com/open-source/open-sauce)

