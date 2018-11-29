# Things that changed in V3

## Breaking changes
- create a `canvasScreenshot` of an element has been removed
- `saveFullPageScreens` has been renamed to `saveFullPageScreen`
- `nativeWebScreenshot` has been removed from the options. This can only be added/determined from the capabilities
- dropped support for Firefox 47
- dropped support for Safari 9
- all compare options now need to be provided in a `compareOptions`-object

```js
// Old
const options = {
	blockOut: [
		{x: 10, y: 132, width: 100, height: 50},
		{x: 450, y: 300, width: 25, height: 75},
	],
	blockOutStatusBar: true,
	ignoreAlpha: false,
	ignoreAntialiasing: true,
	ignoreColors: false,
	ignoreLess: false,
	ignoreNothing: false,
	ignoreTransparentPixel: true,
	rawMisMatchPercentage: true,
	saveAboveTolerance: 0,
};

// New
const options = {
	compareOptions:{
		blockOut: [
			{x: 10, y: 132, width: 100, height: 50},
			{x: 450, y: 300, width: 25, height: 75},
		],
		blockOutStatusBar: true,
		ignoreAlpha: false,
		ignoreAntialiasing: true,
		ignoreColors: false,
		ignoreLess: false,
		ignoreNothing: false,
		ignoreTransparentPixel: true,
		rawMisMatchPercentage: true,
		saveAboveTolerance: 0,
	},
};
```

## NEW
- `resizeDimensions` for `saveElement` and `checkElement` will now accept an object in pixels, see below

```
{
  resizeDimensions: {
    left: 10,
    top: 20,
    right: 15,
    bottom: 25,
  }
}
```

- `savePerInstance` for the main options. This will save each screenshot in a subfolder which is named after the desktop `browserName` or if mobile the `deviceName` from the capabilities
- `returnAllCompareData`: By default the comparison will return a mismatch percentage, if `returnAllCompareData: true` is used a complete data object will be returned like:

```js
const data =  { 
	fileName: 'examplePage-chrome-latest-1366x768.png',
	folders: { 
		actual: '/users/git/protractor-image-comparison/.tmp/actual/desktop_chrome/examplePage-chrome-latest-1366x768.png',
  	baseline: '/users/git/protractor-image-comparison/test/saucebaseline/desktop_chrome/examplePage-chrome-latest-1366x768.png',
  	diff: '/users/git/protractor-image-comparison/actual/desktop_chrome/examplePage-chrome-latest-1366x768.png', 
  },
  misMatchPercentage: 0,
};
```


## Deprecated
- On `saveElement` and `checkElement` there is an option to add `resizeDimensions`. This was just a `number`, like this `{resizeDimensions:15}`. This is deprecated, it needs to be an object like this

```
{
  resizeDimensions: {
    left: 10,
    top: 20,
    right: 15,
    bottom: 25,
  }
}
```
