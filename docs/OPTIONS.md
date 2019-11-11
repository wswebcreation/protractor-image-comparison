# Options
This plugin uses the options and options documentation from [webdriver-image-comparison](https://github.com/wswebcreation/webdriver-image-comparison).

> **NOTE:** Clicking on the links will open a new TAB 

## Plugin options
Plugin options are the options that can be set when the plugin is instantiated and can be found <a href="https://github.com/wswebcreation/webdriver-image-comparison/blob/master/docs/OPTIONS.md#plugin-options" target="_blank">here</a>.
An example can be find below:

```js
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
				autoSaveBaseline: true,
				blockOutToolBar: true,
				clearRuntimeFolder: true,
				// ... more options
			},
		},
	],
};
```

### baselineFolder
This option can be `string`, `function`, or `async function`.
For example, we can create custom folder name for every browser instance:

```js
savePerInstance: false,
// argument is current plugin options
baselineFolder: async (options) => {
  const capabilities = await browser.getCapabilities();
  const version = capabilities.get('browserVersion') || capabilities.get('version');
  const browserName = capabilities.get('browserName');

  if (IS_HEADLESS) {
    return `desktop_${ browserName }_headless`
  }
  return `desktop_${ browserName }_${ version }`
}
```

## Method options
Methods options are the options that can be set per method. If the option has the same key as an options that has been set during the instantiation of the plugin, this method option will override the plugin option value.
They can be found <a href="https://github.com/wswebcreation/webdriver-image-comparison/blob/master/docs/OPTIONS.md#method-options" target="_blank">here</a>.
You can now also set folder options, see [here](#folder-options).

An example for all methods can be found below:

```js
import {$, browser} from 'protractor';

describe('protractor-image-comparison desktop', () => {
  beforeEach(async () => {
    await browser.get(browser.baseUrl);
  });
  
  it('should save some screenshots', async() => {
  	// Save a screen
  	await browser.imageComparison.saveScreen('examplePaged', {
  		disableCSSAnimation: true,
  		hideScrollBars: true,
  	});
  	
  	// Save an element
  	await browser.imageComparison.saveElement($('.uk-button:nth-child(1)'), 'firstButtonElement', {
  		resizeDimensions: { 
  			top: 10, 
  			right: 5, 
  			bottom: 30, 
  			left: 10,
  		}
  	});
  	
  	// Save a full page screens
  	await browser.imageComparison.saveFullPageScreen('fullPage', {
  		fullPageScrollTimeout: 3000,
  	});
	});
  
  it('should compare successful with a baseline', async() => {
  	// Check a screen
  	expect(await browser.imageComparison.checkScreen('examplePaged', {
  		blockOut: [ {
  				height: 10, 
  				width: 5, 
  				x: 40, 
  				y: 65
  			},{
  				height: 250, 
  				width: 500,
  				x: 0,
  				y: 35
  			},
  		],
  		ignoreAlpha: true,
  		blockOutStatusBar: true,
  		hideElements: [$('#id')],
			removeElements: [$('#id2')],
  	})).toEqual(0);
  	
  	// Check an element
  	expect(await browser.imageComparison.checkElement($('.uk-button:nth-child(1)'), 'firstButtonElement', {
  		ignoreAntialiasing: true,
  		
  	})).toEqual(0);
  	
  	// Check a full page screens
  	expect(await browser.imageComparison.checkFullPageScreen('fullPage', {
  		ignoreColors: true,
  		hideAfterFirstScroll: [$('#sticky-header')],
  	})).toEqual(0);
	});
});
``` 

## Compare options
Compare options are the options that can be set during instantiation of the plugin or per method. If the options has the same key as an option that has been set during the instantiation of the plugin, the method compare option will override the plugin compare option value.
They can be found <a href="https://github.com/wswebcreation/webdriver-image-comparison/blob/master/docs/OPTIONS.md#compare-options" target="_blank">here</a>.
The usage can be found above in the plugin and method examples.

## Folder options
The baseline folder and screenshot folders(actual, diff) are options that can be set during instantiation of the plugin or method. To set the folder options on a particular method, pass in folder options to the methods option object

```js
const methodOptions = {
    actualFolder: path.join(process.cwd(), './testActual'),
    baselineFolder: path.join(process.cwd(), './testBaseline'),
    diffFolder: path.join(process.cwd(), './testDiff')
};

expect(await browser.imageComparison.checkFullPageScreen('checkFullPage', methodOptions)).toEqual(0);

const methodOptions = {
    actualFolder: path.join(process.cwd(), './testActual')
};
const imageData = await browser.imageComparison.saveFullPageScreen('saveFullPage', methodOptions);
```