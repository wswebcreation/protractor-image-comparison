# Things that changed in V3

## Breaking changes
- create a `canvasScreenshot` of an element has been removed
- `saveFullPageScreens` has been renamed to `saveFullPageScreen`
- `nativeWebScreenshot` has been removed from the options. This can only be added/determined from the capabilities
- `ignoreTransparentPixel` has been removed from the options.
- `androidOffsets` and `iosOffsets` have been removed from the options. They are now set for a lot of iOS and Android versions in the [`webdriver-image-comparison constants.ts`](https://github.com/wswebcreation/webdriver-image-comparison/blob/master/lib/helpers/constants.ts)
- dropped support for Firefox 47
- dropped support for Safari 9

## NEW
- The `png-image` and `pngjs-image` are now completely removed and replaced by the latest version of [`canvas`](https://github.com/Automattic/node-canvas)
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

- `savePerInstance` for the plugin options. This will save each screenshot in a subfolder which is named after the desktop `browserName` or if mobile the `deviceName` from the capabilities
- `blockOutToolBar`: By default the comparison will also compare a toolbar on a screenshot. It could be that you also want to block this one out during comparions due to gradients based on the background of the page (take for example the Samsung S8 with the onscreen toolbar). By providing the option `blockOutToolBar: true` this module will automatically blockout the toolbar on all mobile devices during comparison
- all save methods now also return data that can be used after a save methods has been used. It will return an object of data like this

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

- `returnAllCompareData`: By default the comparison will return a mismatch percentage, if `returnAllCompareData: true` is used a complete data object will be returned like:

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
