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
				// ... more options
			},
		},
	],
};
``` 

## Method options
Methods options are the options that can be set per method. If the option has the same key as an options that has been set during the instantiation of the plugin, this method option will override the plugin option value.
They can be found <a href="https://github.com/wswebcreation/webdriver-image-comparison/blob/master/docs/OPTIONS.md#method-options" target="_blank">here</a>.

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
  	})).toEqual(0);
  	
  	// Check an element
  	expect(await browser.imageComparison.checkElement($('.uk-button:nth-child(1)'), 'firstButtonElement', {
  		ignoreAntialiasing: true,
  		
  	})).toEqual(0);
  	
  	// Check a full page screens
  	expect(await browser.imageComparison.checkFullPageScreen('fullPage', {
  		ignoreColors: true,
  	})).toEqual(0);
	});
});
``` 

## Compare options
Compare options are the options that can be set during instantiation of the plugin or per method. If the options has the same key as an option that has been set during the instantiation of the plugin, the method compare option will override the plugin compare option value.
They can be found <a href="https://github.com/wswebcreation/webdriver-image-comparison/blob/master/docs/OPTIONS.md#compare-options" target="_blank">here</a>.
The usage can be found above in the plugin and method examples.
