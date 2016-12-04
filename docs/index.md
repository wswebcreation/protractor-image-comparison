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
<dt><a href="#checkFullPage">checkFullPage(tag, options)</a> ⇒ <code>Promise</code></dt>
<dd><p>Runs the comparison against the fullpage screenshot</p>
</dd>
<dt><a href="#checkScreen">checkScreen(tag, options)</a> ⇒ <code>Promise</code></dt>
<dd><p>Runs the comparison against the screen</p>
</dd>
<dt><a href="#saveElement">saveElement(element, tag, options)</a> ⇒ <code>Promise</code></dt>
<dd><p>Saves an image of the screen element</p>
</dd>
<dt><a href="#saveFullPageScreenshot">saveFullPageScreenshot(tag, options)</a> ⇒ <code>Promise</code></dt>
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
| diffFolder | <code>string</code> | Path where the differences are saved |
| devicePixelRatio | <code>int</code> | Ratio of the (vertical) size of one physical pixel on the current display device to the size of one device independent pixels(dips) |
| androidOffsets | <code>object</code> | Object that will hold de defaults for the statusBar, addressBar and toolBar |
| iosOffsets | <code>object</code> | Object that will hold de defaults for the statusBar and addressBar |
| screenshotHeight | <code>int</code> | height of the screenshot of the page |
| resizeDimensions | <code>int</code> | dimensions that will be used to make the the element coordinates bigger. This needs to be in pixels |
| tempFullScreenFolder | <code>string</code> | Path where the temporary fullscreens are saved |
| fullPageScrollTimeout | <code>int</code> | Default timeout to wait after a scroll |

<a name="new_protractorImageComparison_new"></a>

### new protractorImageComparison(options)

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> |  |
| options.baselineFolder | <code>string</code> | Path to the baseline folder |
| options.screenshotPath | <code>string</code> | Path to the folder where the screenshots are saved |
| options.debug | <code>boolean</code> | Add some extra logging and always save the image difference |
| options.formatImageOptions | <code>string</code> | Custom variables for Image Name |
| options.disableCSSAnimation | <code>boolean</code> | Disable all animations on a page |
| options.nativeWebScreenshot | <code>boolean</code> | If a native screenshot of a device (complete screenshot) needs to be taken |
| options.blockOutStatusBar | <code>boolean</code> | If the statusbar on mobile / tablet needs to blocked out by default |
| options.androidOffsets | <code>object</code> | Object that will hold custom values for the statusBar, addressBar and toolBar |
| options.iosOffsets | <code>object</code> | Object that will hold the custom values for the statusBar and addressBar |

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
| options.resizeDimensions | <code>int</code> | the value to increase the size of the element that needs to be saved |
| options.disableCSSAnimation | <code>boolean</code> | enable or disable CSS animation |

**Example**  
```js
// default usage
browser.protractorImageComparison.checkElement(element(By.id('elementId')), 'imageA');
// blockout example
browser.protractorImageComparison.checkElement(element(By.id('elementId')), 'imageA', {blockOut: [{x: 10, y: 132, width: 100, height: 50}]});
// Add 15 px to top, right, bottom and left when the cut is calculated (it will automatically use the DPR)
browser.protractorImageComparison.saveElement(element(By.id('elementId')), 'imageA', {resizeDimensions: 15});
// Disable css animation on all elements
browser.protractorImageComparison.saveElement(element(By.id('elementId')), 'imageA', {disableCSSAnimation: true});
```
<a name="checkFullPage"></a>

## checkFullPage(tag, options) ⇒ <code>Promise</code>
Runs the comparison against the fullpage screenshot

**Kind**: global function  
**Returns**: <code>Promise</code> - When the promise is resolved it will return the percentage of the difference  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| tag | <code>string</code> | The tag that is used |
| options | <code>object</code> | (non-default) options |
| options.blockOutStatusBar | <code>boolean</code> | blockout the statusbar yes or no |
| options.blockOut | <code>object</code> | blockout with x, y, width and height values, it will override the global |
| options.disableCSSAnimation | <code>boolean</code> | enable or disable CSS animation |

**Example**  
```js
// default
browser.protractorImageComparison.checkFullPage('imageA');
// Blockout the statusbar
browser.protractorImageComparison.checkFullPage('imageA', {blockOutStatusBar: true});
// Blockout a given region
browser.protractorImageComparison.checkFullPage('imageA', {blockOut: [{x: 10, y: 132, width: 100, height: 50}]});
// Blockout a given region
browser.protractorImageComparison.checkFullPage('imageA', {blockOut: [{x: 10, y: 132, width: 100, height: 50}]});
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
| options.blockOutStatusBar | <code>boolean</code> | blockout the statusbar yes or no |
| options.blockOut | <code>object</code> | blockout with x, y, width and height values, it will override the global |
| options.disableCSSAnimation | <code>boolean</code> | enable or disable CSS animation |

**Example**  
```js
// default
browser.protractorImageComparison.checkScreen('imageA');
// Blockout the statusbar
browser.protractorImageComparison.checkScreen('imageA', {blockOutStatusBar: true});
// Disable css animation on all elements
browser.protractorImageComparison.checkScreen('imageA', {disableCSSAnimation: true});
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

**Example**  
```js
// Default
browser.protractorImageComparison.saveElement(element(By.id('elementId')), 'imageA');
// Add 15 px to top, right, bottom and left when the cut is calculated (it will automatically use the DPR)
browser.protractorImageComparison.saveElement(element(By.id('elementId')), 'imageA', {resizeDimensions: 15});
// Disable css animation on all elements
browser.protractorImageComparison.saveElement(element(By.id('elementId')), 'imageA', {disableCSSAnimation: true});
```
<a name="saveFullPageScreenshot"></a>

## saveFullPageScreenshot(tag, options) ⇒ <code>Promise</code>
Saves a full page image of the screen

**Kind**: global function  
**Returns**: <code>Promise</code> - The image has been saved when the promise is resolved  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| tag | <code>string</code> | The tag that is used |
| options | <code>object</code> | (non-default) options |
| options.timeout | <code>int</code> | The time that needs to be waited when scrolling to a point and save the screenshot |
| options.disableCSSAnimation | <code>boolean</code> | enable or disable CSS animation |

**Example**  
```js
// Default
browser.protractorImageComparison.saveFullPageScreenshot('imageA');
// Disable css animation on all elements
browser.protractorImageComparison.saveFullPageScreenshot('imageA',{disableCSSAnimation: true});
// Default
browser.protractorImageComparison.saveFullPageScreenshot('imageA',{timeout: 5000});
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
// Default
browser.protractorImageComparison.saveScreen('imageA');
// Disable css animation on all elements
browser.protractorImageComparison.saveScreen('imageA',{disableCSSAnimation: true});
```
