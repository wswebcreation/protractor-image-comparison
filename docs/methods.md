# Methods

## saveScreen or checkScreen
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

Code details and example usage about `saveScreen` can be found [here](./index.md#saveScreen) and about `checkScreen` can be found [here](./index.md#checkScreen).

## saveElement or checkElement
Images are cropped from the complete screenshot by using the `saveElement` or `checkElement` function.
The method will calculate the correct dimensions based upon the webdriver element selector.

> You can now also directly take a screenshot of a canvas element by providing `{canvasScreenshot: true}`

### resizeDimensions
Sometimes it is needed that the cut of an image should be bigger then the element itself. Take for example the hover state. A kind of a box / halo can be presented around the element that is not placed within but outside the element. With `resizeDimensions` the size of the cut of the element image can be made bigger.
`resizeDimensions` accepts an integer and the value need to represent pixels. Calculation against the devicepixelratio will be done by `protractor-image-comparison`.
For example:

```js
// When ONLY saving an element
expect(
    browser.imageComparson.saveElement(
        element(by.css('#id')),
        'tagName',
        {
            resizeDimensions: 15
        }
    )
).toEqual(0);
// When COMPARING an element
expect(
    browser.imageComparson.checkElement(
        element(by.css('#id')),
        'tagName',
        {
            resizeDimensions: 15
        }
    )
).toEqual(0);
```

More code details and example usage about `saveElement` can be found [here](./index.md#saveElement) and about `checkElement` can be found [here](./index.md#checkElement).

## saveFullPageScreens or checkFullPageScreen
The methods `saveFullPageScreens` and `checkFullPageScreen` create a screenshot of the **complete** page. Basically it will divide the complete page into multiple viewports.
Then it will scroll to each viewport, waits a given timeout (default 1000 milliseconds) and takes a screenshot. When all the viewports have been captured it will compose a new complete fullpage screenshot.
These methods will also work on pages with lazyloading. By altering the `timeout` you can set it to wait for how long the lazyloading will take and then take a screenshot. It wil automatically recalculate the height of the full screen

Code details and example usage about `saveFullPageScreens` can be found [here](./index.md#saveFullPageScreens) and about `checkFullPageScreen` can be found [here](./index.md#checkFullPageScreen)
