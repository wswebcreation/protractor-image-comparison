Examples
========
## Configuration file setup:
Load it from the configuration file of *protractor*

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

## Jasmine Example:
Load it in a *spec* file

```js
const protractorImageComparison = require('protractor-image-comparison');

describe("Example page", function() {
    // Or instantiate `protractor-image-comparison` in a beforeEach or in your protractor conf, see above
    beforeEach(function() {
        browser.protractorImageComparison = new protractorImageComparison({
            baselineFolder: './baseline/',
            screenshotPath: './.tmp/'
        });
        browser.get('http://www.example.com/');
    });

    it("should match the page", () => {
        expect(browser.protractorImageComparison.checkScreen('examplePage')).toEqual(0);
    });

    it("should not match the page", () => {
        element(By.buttonText('yes')).click();
        expect(browser.protractorImageComparison.checkScreen('examplePage')).not.toEqual(0);
    });

    it("should match the title", () => {
        expect(browser.protractorImageComparison.checkElement(element(By.id('title')), 'examplePageTitle')).toEqual(0);
    });

    it("should match the title with blockout", () => {
        expect(browser.protractorImageComparison.checkElement(element(By.id('title')), 'examplePageTitle', {
            blockOut: [{x: 10, y: 132, width: 100, height: 50}]})).toEqual(0);
    });
});
```

For more examples / usage see the [desktop](../test/desktop.spec.js) or [mobile](../test/desktop.spec.js) testcases.
