## Classes

<dl>
<dt><a href="#protractorImageComparison">protractorImageComparison</a></dt>
<dd><p>protractorImageComparison</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#checkElement">checkElement(element, tag, options)</a> ⇒ <code>Promise</code></dt>
<dd><p>Runs the comparison against an element</p>
</dd>
<dt><a href="#checkFullPageScreen">checkFullPageScreen(tag, options)</a> ⇒ <code>Promise</code></dt>
<dd><p>Runs the comparison against the fullpage screenshot</p>
</dd>
<dt><a href="#checkScreen">checkScreen(tag, options)</a> ⇒ <code>Promise</code></dt>
<dd><p>Runs the comparison against the screen</p>
</dd>
<dt><a href="#saveElement">saveElement(element, tag, options)</a> ⇒ <code>Promise</code></dt>
<dd><p>Saves an image of the screen element</p>
</dd>
<dt><a href="#saveFullPageScreens">saveFullPageScreens(tag, options)</a> ⇒ <code>Promise</code></dt>
<dd><p>Saves a full page image of the screen</p>
</dd>
<dt><a href="#saveScreen">saveScreen(tag, options)</a> ⇒ <code>Promise</code></dt>
<dd><p>Saves an image of the screen</p>
</dd>
</dl>

<a name="protractorImageComparison"></a>

## protractorImageComparison
protractorImageComparison

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| actualFolder | <code>string</code> | Path where the actual screenshots are saved |
| addressBarShadowPadding | <code>number</code> | Mobile Chrome and mobile Safari have a shadow below the addressbar, this property will make sure that it wont be seen in the image |
| androidOffsets | <code>object</code> | Object that will hold de defaults for the statusBar, addressBar and toolBar |
| browserHeight | <code>number</code> | height of the browser |
| browserName | <code>string</code> | name of the browser that is used to execute the test on |
| browserWidth | <code>number</code> | width of the browser |
| deviceName | <code>string</code> | the kind of mobile device or emulator to use |
| diffFolder | <code>string</code> | Path where the differences are saved |
| devicePixelRatio | <code>number</code> | Ratio of the (vertical) size of one physical pixel on the current display device to the size of one device independent pixels(dips) |
| fullPageHeight | <code>number</code> | fullPageHeight of the browser including scrollbars |
| fullPageWidth | <code>number</code> | fullPageWidth of the browser including scrollbars * |
| iosOffsets | <code>object</code> | Object that will hold de defaults for the statusBar and addressBar |
| isLastScreenshot | <code>boolean</code> | boolean tells if it is the last fullpage screenshot |
| logName | <code>string</code> | logName from the capabilities |
| name | <code>string</code> | Name from the capabilities |
| platformName | <code>string</code> | mobile OS platform to use |
| resizeDimensions | <code>number</code> | dimensions that will be used to make the the element coordinates bigger. This needs to be in pixels |
| screenshotHeight | <code>number</code> | height of the screenshot of the page |
| tempFullScreenFolder | <code>string</code> | Path where the temporary fullscreens are saved |
| fullPageScrollTimeout | <code>number</code> | Default timeout to wait after a scroll |
| saveType | <code>object</code> | Object that will the type of save that is being executed |
| rawMisMatchPercentage | <code>boolean</code> | default false. If true the return percentage will be like 0.12345678, default is 0.12 |
| testInBrowser | <code>boolean</code> | boolean that determines if the test is executed in a browser or not |
| toolBarShadowPadding | <code>number</code> | Mobile mobile Safari has a shadow above the toolbar, this property will make sure that it wont be seen in the image |
| viewPortHeight | <code>number</code> | is the height of the browser window's viewport (was innerHeight |

<a name="new_protractorImageComparison_new"></a>

### new protractorImageComparison(options)

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> |  |
| options.baselineFolder | <code>string</code> | Path to the baseline folder |
| options.screenshotPath | <code>string</code> | Path to the folder where the screenshots are saved |
| options.autoSaveBaseline | <code>boolean</code> | If no baseline image is found the image is automatically copied to the baselinefolder |
| options.debug | <code>boolean</code> | Add some extra logging and always save the image difference (default:false) |
| options.formatImageName | <code>string</code> | Custom variables for Image Name (default:{tag}-{browserName}-{width}x{height}-dpr-{dpr}) |
| options.disableCSSAnimation | <code>boolean</code> | Disable all css animations on a page (default:false) |
| options.hideScrollBars | <code>boolean</code> | Hide all scrolls on a page (default:true) |
| options.nativeWebScreenshot | <code>boolean</code> | If a native screenshot of a device (complete screenshot) needs to be taken (default:false) |
| options.blockOutStatusBar | <code>boolean</code> | If the statusbar on mobile / tablet needs to blocked out by default |
| options.ignoreAlpha | <code>boolean</code> | compare images and discard alpha |
| options.ignoreAntialiasing | <code>boolean</code> | compare images and discard anti aliasing |
| options.ignoreColors | <code>boolean</code> | Even though the images are in colour, the comparison wil compare 2 black/white images |
| options.ignoreLess | <code>boolean</code> | compare images and compare with red = 16, green = 16, blue = 16, alpha = 16, minBrightness=16, maxBrightness=240 |
| options.ignoreNothing | <code>boolean</code> | compare images and compare with red = 0, green = 0, blue = 0, alpha = 0, minBrightness=0, maxBrightness=255 |
| options.ignoreTransparentPixel | <code>boolean</code> | Will ignore all pixels that have some transparency in one of the images |
| options.rawMisMatchPercentage | <code>boolean</code> | default false. If true the return percentage will be like 0.12345678, default is 0.12 |
| options.androidOffsets | <code>object</code> | Object that will hold custom values for the statusBar, addressBar, addressBarScrolled and toolBar |
| options.iosOffsets | <code>object</code> | Object that will hold the custom values for the statusBar, addressBar, addressBarScrolled and toolBar |
| options.saveAboveTolerance | <code>number</code> | Allowable value of misMatchPercentage that prevents saving image with differences |
| options.clearFolder | <code>boolean</code> | Delete runtime folder (actual & diff) on initialisation |

<a name="checkElement"></a>

## checkElement(element, tag, options) ⇒ <code>Promise</code>
Runs the comparison against an element

**Kind**: global function  
**Returns**: <code>Promise</code> - When the promise is resolved it will return the percentage of the difference  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>Promise</code> | The ElementFinder that is used to get the position |
| tag | <code>string</code> | The tag that is used |
| options | <code>object</code> | non-default options |
| options.blockOut | <code>object</code> | blockout with x, y, width and height values |
| options.disableCSSAnimation | <code>boolean</code> | enable or disable CSS animation |
| options.resizeDimensions | <code>int</code> | the value to increase the size of the element that needs to be saved |
| options.saveAboveTolerance | <code>double</code> | Allowable percentage of mismatches before a diff is saved |
| options.ignoreAlpha | <code>boolean</code> | compare images and discard alpha |
| options.ignoreAntialiasing | <code>boolean</code> | compare images and discard anti aliasing |
| options.ignoreColors | <code>boolean</code> | Even though the images are in colour, the comparison wil compare 2 black/white images |
| options.ignoreLess | <code>boolean</code> | compare images and compare with red = 16, green = 16, blue = 16, alpha = 16, minBrightness=16, maxBrightness=240 |
| options.ignoreNothing | <code>boolean</code> | compare images and compare with red = 0, green = 0, blue = 0, alpha = 0, minBrightness=0, maxBrightness=255 |
| options.ignoreTransparentPixel | <code>boolean</code> | Will ignore all pixels that have some transparency in one of the images |

**Example**  
```js
// default
browser.protractorImageComparison.checkElement(element(By.id('elementId')), 'imageA');
// With options
browser.protractorImageComparison.checkElement(element(By.id('elementId')), 'imageA', {
     // Blockout the statusbar, mobile only
     blockOutStatusBar: true
     // Blockout a given region || multiple regions
     blockOut: [
       {x: 10, y: 132, width: 100, height: 50},
       {x: 450, y: 300, width: 25, height: 75},
     ],
     // Disable css animation on all elements
     disableCSSAnimation: true,
     // Add 15 px to top, right, bottom and left when the cut is calculated (it will automatically use the DPR)
     resizeDimensions: 15,
     // Set allowable percentage of mismatches before a diff is saved
     saveAboveTolerance: 0.5,
     // Ignore alpha and or antialiasing and or colors and or less and or nothing and or a transparant pixel
     ignoreAlpha: true,
     ignoreAntialiasing: true,
     ignoreColors: true,
     ignoreLess: true,
     ignoreNothing: true,
     ignoreTransparentPixel: true,
   }
);
```
<a name="checkFullPageScreen"></a>

## checkFullPageScreen(tag, options) ⇒ <code>Promise</code>
Runs the comparison against the fullpage screenshot

**Kind**: global function  
**Returns**: <code>Promise</code> - When the promise is resolved it will return the percentage of the difference  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| tag | <code>string</code> | The tag that is used |
| options | <code>object</code> | (non-default) options |
| options.blockOutStatusBar | <code>boolean</code> | blockout the statusbar yes or no, it will override the global |
| options.blockOut | <code>object</code> | blockout with x, y, width and height values |
| options.disableCSSAnimation | <code>boolean</code> | enable or disable CSS animation |
| options.fullPageScrollTimeout | <code>int</code> | The time that needs to be waited when scrolling to a point and save the screenshot |
| options.saveAboveTolerance | <code>double</code> | Allowable percentage of mismatches before a diff is saved |
| options.ignoreAlpha | <code>boolean</code> | compare images and discard alpha |
| options.ignoreAntialiasing | <code>boolean</code> | compare images and discard anti aliasing |
| options.ignoreColors | <code>boolean</code> | Even though the images are in colour, the comparison wil compare 2 black/white images |
| options.ignoreLess | <code>boolean</code> | compare images and compare with red = 16, green = 16, blue = 16, alpha = 16, minBrightness=16, maxBrightness=240 |
| options.ignoreNothing | <code>boolean</code> | compare images and compare with red = 0, green = 0, blue = 0, alpha = 0, minBrightness=0, maxBrightness=255 |
| options.ignoreTransparentPixel | <code>boolean</code> | Will ignore all pixels that have some transparency in one of the images |

**Example**  
```js
// default
browser.protractorImageComparison.checkFullPageScreen('imageA');
// With options
browser.protractorImageComparison.checkFullPageScreen('imageA', {
     // Blockout the statusbar, mobile only
     blockOutStatusBar: true
     // Blockout a given region || multiple regions
     blockOut: [
       {x: 10, y: 132, width: 100, height: 50},
       {x: 450, y: 300, width: 25, height: 75},
     ],
     // Disable css animation on all elements
     disableCSSAnimation: true,
     // The time that needs to be waited when scrolling to a point and save the screenshot
     fullPageScrollTimeout: 5000,
     // Set allowable percentage of mismatches before a diff is saved
     saveAboveTolerance: 0.5,
     // Ignore alpha and or antialiasing and or colors and or less and or nothing and or a transparant pixel
     ignoreAlpha: true,
     ignoreAntialiasing: true,
     ignoreColors: true,
     ignoreLess: true,
     ignoreNothing: true,
     ignoreTransparentPixel: true,
   }
);
```
<a name="checkScreen"></a>

## checkScreen(tag, options) ⇒ <code>Promise</code>
Runs the comparison against the screen

**Kind**: global function  
**Returns**: <code>Promise</code> - When the promise is resolved it will return the percentage of the difference  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| tag | <code>string</code> | The tag that is used |
| options | <code>object</code> | (non-default) options |
| options.blockOutStatusBar | <code>boolean</code> | blockout the statusbar yes or no, it will override the global |
| options.blockOut | <code>object</code> | blockout with x, y, width and height values |
| options.disableCSSAnimation | <code>boolean</code> | enable or disable CSS animation |
| options.saveAboveTolerance | <code>double</code> | Allowable percentage of mismatches before a diff is saved |
| options.ignoreAlpha | <code>boolean</code> | compare images and discard alpha |
| options.ignoreAntialiasing | <code>boolean</code> | compare images and discard anti aliasing |
| options.ignoreColors | <code>boolean</code> | Even though the images are in colour, the comparison wil compare 2 black/white images |
| options.ignoreLess | <code>boolean</code> | compare images and compare with red = 16, green = 16, blue = 16, alpha = 16, minBrightness=16, maxBrightness=240 |
| options.ignoreNothing | <code>boolean</code> | compare images and compare with red = 0, green = 0, blue = 0, alpha = 0, minBrightness=0, maxBrightness=255 |
| options.ignoreTransparentPixel | <code>boolean</code> | Will ignore all pixels that have some transparency in one of the images |

**Example**  
```js
// default
browser.protractorImageComparison.checkScreen('imageA');
// With options
browser.protractorImageComparison.checkScreen('imageA', {
     // Blockout the statusbar, mobile only
     blockOutStatusBar: true
     // Blockout a given region || multiple regions
     blockOut: [
       {x: 10, y: 132, width: 100, height: 50},
       {x: 450, y: 300, width: 25, height: 75},
     ],
     // Disable css animation on all elements
     disableCSSAnimation: true,
     // Set allowable percentage of mismatches before a diff is saved
     saveAboveTolerance: 0.5,
     // Ignore alpha and or antialiasing and or colors and or less and or nothing and or a transparant pixel
     ignoreAlpha: true,
     ignoreAntialiasing: true,
     ignoreColors: true,
     ignoreLess: true,
     ignoreNothing: true,
     ignoreTransparentPixel: true,
   }
);
```
<a name="saveElement"></a>

## saveElement(element, tag, options) ⇒ <code>Promise</code>
Saves an image of the screen element

**Kind**: global function  
**Returns**: <code>Promise</code> - The images has been saved when the promise is resolved  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>Promise</code> | The ElementFinder that is used to get the position |
| tag | <code>string</code> | The tag that is used |
| options | <code>object</code> | (non-default) options |
| options.resizeDimensions | <code>int</code> | the value to increase the size of the element that needs to be saved |
| options.disableCSSAnimation | <code>boolean</code> | enable or disable CSS animation |
| options.canvasScreenshot | <code>boolean</code> | enable or disable taking screenshot directly from canvas (via dataUrl instead of browser.takeScreenshot()). !!This isn't supported in IE11 and Safari 9!! |

**Example**  
```js
// default
browser.protractorImageComparison.saveElement(element(By.id('elementId')), 'imageA');
// With options
browser.protractorImageComparison.saveElement(element(By.id('elementId')), 'imageA', {
     // Disable css animation on all elements
     disableCSSAnimation: true,
     // Add 15 px to top, right, bottom and left when the cut is calculated (it will automatically use the DPR)
     resizeDimensions: 15,
     // Take screenshot directly of a canvas element
     canvasScreenshot: true
   }
);
```
<a name="saveFullPageScreens"></a>

## saveFullPageScreens(tag, options) ⇒ <code>Promise</code>
Saves a full page image of the screen

**Kind**: global function  
**Returns**: <code>Promise</code> - The image has been saved when the promise is resolved  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| tag | <code>string</code> | The tag that is used |
| options | <code>object</code> | (non-default) options |
| options.fullPageScrollTimeout | <code>int</code> | The time that needs to be waited when scrolling to a point and save the screenshot |
| options.disableCSSAnimation | <code>boolean</code> | enable or disable CSS animation |

**Example**  
```js
// default
browser.protractorImageComparison.saveFullPageScreens('imageA');
// With options
browser.protractorImageComparison.saveFullPageScreens('imageA', {
     // Disable css animation on all elements
     disableCSSAnimation: true,
     // The time that needs to be waited when scrolling to a point and save the screenshot
     fullPageScrollTimeout: 5000,
   }
);
```
<a name="saveScreen"></a>

## saveScreen(tag, options) ⇒ <code>Promise</code>
Saves an image of the screen

**Kind**: global function  
**Returns**: <code>Promise</code> - The image has been saved when the promise is resolved  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| tag | <code>string</code> | The tag that is used |
| options | <code>object</code> | (non-default) options |
| options.disableCSSAnimation | <code>boolean</code> | enable or disable CSS animation |

**Example**  
```js
// default
browser.protractorImageComparison.saveScreen('imageA');
// With options
browser.protractorImageComparison.saveScreen('imageA', {
     // Disable css animation on all elements
     disableCSSAnimation: true,
   }
);
```
