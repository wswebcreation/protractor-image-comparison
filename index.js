'use strict';

const assert = require('assert'),
    camelCase = require('camel-case'),
    fs = require('fs'),
    mkdirp = require('mkdirp'),
    path = require('path'),
    PNGImage = require('png-image'),
    ResembleJS = require('./lib/resemble');

/**
 * image-diff protractor plugin class
 *
 * @constructor
 * @class protractorImageComparison
 * @param {object} options
 * @param {string} options.baselineFolder Path to the baseline folder
 * @param {string} options.screenshotPath Path to the folder where the screenshots are saved
 * @param {string} options.formatImageOptions Custom variables for Image Name
 * @param {boolean} options.nativeWebScreenshot If a native screenshot of a device (complete screenshot) needs to be taken
 * @param {boolean} options.blockOutStatusBar  If the statusbar on mobile / tablet needs to blocked out by default
 * @param {object} options.androidOffsets Object that will hold custom values for the statusBar, addressBar and toolBar
 * @param {object} options.iosOffsets Object that will hold the custom values for the statusBar and addressBar
 *
 * @property {string} actualFolder Path where the actual screenshots are saved
 * @property {string} diffFolder Path where the differences are saved
 * @property {int} devicePixelRatio Ratio of the (vertical) size of one physical pixel on the current display device to the size of one device independent pixels(dips)
 * @property {object} androidOffsets Object that will hold de defaults for the statusBar, addressBar and toolBar
 * @property {object} iosOffsets Object that will hold de defaults for the statusBar and addressBar
 * @property {int} screenshotHeight height of the screenshot of the page
 * @property {int} resizeDimensions dimensions that will be used to make the the element coordinates bigger. This needs to be in pixels
 */

class protractorImageComparison {
    constructor(options) {
        assert.ok(options.baselineFolder, 'Image baselineFolder not given.');
        assert.ok(options.screenshotPath, 'Image screenshotPath not given.');

        this.baselineFolder = path.normalize(options.baselineFolder);
        this.baseFolder = path.normalize(options.screenshotPath);
        this.formatString = options.formatImageName || '{tag}-{browserName}-{width}x{height}-dpr-{dpr}';

        this.nativeWebScreenshot = options.nativeWebScreenshot ? true : false;
        this.blockOutStatusBar = options.blockOutStatusBar ? true : false;

        // OS offsets
        let androidOffsets = options.androidOffsets && typeof options.androidOffsets === 'object' ? options.androidOffsets : {},
            iosOffsets = options.iosOffsets && typeof options.iosOffsets === 'object' ? options.iosOffsets : {},
            androidDefaultOffsets = {
                statusBar: 24,
                addressBar: 56,
                toolBar: 48
            },
            iosDefaultOffsets = {
                statusBar: 20,
                addressBar: 44
            };

        this.androidOffsets = this._mergeDefaultOptions(androidDefaultOffsets, androidOffsets);
        this.iosOffsets = this._mergeDefaultOptions(iosDefaultOffsets, iosOffsets);

        this.actualFolder = path.join(this.baseFolder, 'actual');

        this.diffFolder = path.join(this.baseFolder, 'diff');

        this.devicePixelRatio = 1;

        this.screenshotHeight = 0;

        this.resizeDimensions = 0;

        if (!fs.existsSync(this.diffFolder) || !fs.statSync(this.diffFolder).isDirectory()) {
            mkdirp.sync(this.diffFolder);
        }

        if (!fs.existsSync(this.baselineFolder) || !fs.statSync(this.baselineFolder).isDirectory()) {
            mkdirp.sync(this.baselineFolder);
        }

        if (!fs.existsSync(this.actualFolder) || !fs.statSync(this.actualFolder).isDirectory()) {
            mkdirp.sync(this.actualFolder);
        }
    }

    /**
     * Checks if image exists as a baseline image
     * @param {string} tag
     * @returns {Promise}
     * @private
     */
    _checkImageExists(tag) {
        return new Promise((resolve, reject) => {
            fs.access(path.join(this.baselineFolder, this._formatFileName(this.formatString, tag)), fs.F_OK, error => {
                if (error) {
                    reject('Image not found, saving current image as new baseline.');
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * Determine the rectangles conform the correct browser / devicePixelRatio
     * @param {Promise} element The ElementFinder to get the rectangles of
     * @returns {object} returns the correct rectangles rectangles
     * @private
     */
    _determineRectangles(element) {
        let height,
            rect,
            width,
            x,
            y;

        return element.getSize()
            .then(elementSize => {
                height = elementSize.height;
                width = elementSize.width;

                return this._getElementPosition(element);
            })
            .then(position => {
                x = Math.floor(position.x);
                y = Math.floor(position.y);

                if (x < this.resizeDimensions) {
                    console.log('\n WARNING: The x-coordinate may not be negative. No width resizing of the element has been executed\n');
                } else if (((x - this.resizeDimensions) + width + 2 * this.resizeDimensions) > this.width) {
                    console.log('\n WARNING: The new coordinate may not be outside the screen. No width resizing of the element has been executed\n');
                } else {
                    x = x - this.resizeDimensions;
                    width = width + 2 * this.resizeDimensions
                }

                if (y < this.resizeDimensions) {
                    console.log('\n WARNING: The y-coordinate may not be negative. No height resizing of the element has been executed\n');
                } else if (((y - this.resizeDimensions) + height + 2 * this.resizeDimensions) > this.width) {
                    console.log('\n WARNING: The new coordinate may not be outside the screen. No height resizing of the element has been executed\n');
                } else {
                    y = y - this.resizeDimensions;
                    height = height + 2 * this.resizeDimensions
                }

                rect = {
                    height: height,
                    width: width,
                    x: x,
                    y: y
                };

                return this._multiplyObjectValuesAgainstDPR(rect);
            });
    }

    /**
     * Determines the image comparison paths with the tags for the paths + filenames
     * @param {string} tag
     * @returns {Object}
     * @private
     */
    _determineImageComparisonPaths(tag) {
        const imageComparisonPaths = {},
            tagName = this._formatFileName(this.formatString, tag);

        imageComparisonPaths['actualImage'] = path.join(this.actualFolder, tagName);
        imageComparisonPaths['baselineImage'] = path.join(this.baselineFolder, tagName);
        imageComparisonPaths['imageDiffPath'] = path.join(this.diffFolder, path.basename(tagName));

        return imageComparisonPaths;
    }

    /**
     * This methods determines the position of the element to the top of the screenshot based on the fact that a
     * screenshot on Android is a device screenshot including:
     * - statusbar (given default height = 24 px)
     * - addressbar (can variate in height in Chrome. In chrome is can be max 56px but after scroll it will be smaller, the app
     *   doesn't have a navbar)
     * - the view
     * @param {Promise} element The ElementFinder that is used to get the position
     * @returns {Promise} The x/y position of the element
     * @private
     */
    _getAndroidPosition(element) {
        function getDataObject(element, statusBarHeight, addressBarHeight, toolBarHeight) {
            var elementPosition = element.getBoundingClientRect(),
                screenHeight = window.screen.height,
                windowInnerHeight = window.innerHeight,
                addressBarCurrentHeight = 0;

            if (screenHeight === (statusBarHeight + addressBarHeight + windowInnerHeight + toolBarHeight)) {
                addressBarCurrentHeight = addressBarHeight;
            } else if (screenHeight === (statusBarHeight + addressBarHeight + windowInnerHeight )) {
                addressBarCurrentHeight = addressBarHeight;
            }

            return {
                x: elementPosition.left,
                y: statusBarHeight + addressBarCurrentHeight + elementPosition.top
            };
        }

        return browser.driver.executeScript(getDataObject, element.getWebElement(), this.androidOffsets.statusBar, this.androidOffsets.addressBar, this.androidOffsets.toolBar);
    }

    _formatFileName(formatString, tag) {
        let defaults = {
            'browserName': this.browserName,
            'deviceName': this.deviceName,
            'dpr': this.devicePixelRatio,
            'height': this.height,
            'logName': camelCase(this.logName),
            'mobile': this._isMobile() && this.testInBrowser ? this.browserName : this._isMobile() ? 'app' : '',
            'name': this.name,
            'tag': tag,
            'width': this.width
        };

        defaults = this._mergeDefaultOptions(defaults, this.formatOptions);

        Object.keys(defaults).forEach(function (value) {
            formatString = formatString.replace(`{${value}}`, defaults[value]);
        });

        return formatString + '.png';
    }

    /**
     * Get the position of a given element according to the TOP of the PAGE
     * @param {Promise} element The ElementFinder that is used to get the position
     * @returns {Promise} The x/y position of the element
     * @private
     */
    _getElementPositionTopPage(element) {
        return element.getLocation()
            .then(point => {
                return {x: point.x, y: point.y};
            });
    }


    /**
     * Get the position of a given element according to the TOP of the WINDOW
     * @param {Promise} element The ElementFinder that is used to get the position
     * @returns {Promise} The x/y position of the element
     * @private
     */
    _getElementPositionTopWindow(element) {
        return browser.driver.executeScript('return arguments[0].getBoundingClientRect();', element.getWebElement())
            .then(position => {
                return {x: position.left, y: position.top};
            });
    }

    /**
     * Get the position of the element based on OS / Browser / Device.
     * Some webdrivers make a screenshot of the complete page, not of the visbile part.
     * A device can make a complete screenshot of the screen, including statusbar and addressbar / buttonbar, but it can
     * also be created with ChromeDriver. Then a screenshot will be made of the viewport and the calculation is the same
     * as for a Chrome desktop browser.
     * The rest of the browsers make a screenshot of the visible part.
     * @param {Promise} element The ElementFinder that is used to get the position
     * @returns {Promise} The x/y position of the element
     * @private
     */
    _getElementPosition(element) {
        if (this._isIOS()) {
            return this._getIOSPosition(element);
        } else if (this._isAndroid() && this.nativeWebScreenshot) {
            return this._getAndroidPosition(element);
        } else if (this.screenshotHeight > this.innerHeight && !this._isAndroid()) {
            return this._getElementPositionTopPage(element);
        }

        return this._getElementPositionTopWindow(element);
    }

    /**
     * Get the data of the instance that is running
     *
     * @property {string} browserName name of the browser that is used to execute the test on
     * @property {boolean} testInBrowser boolean that determines if the test is executed in a browser or not
     * @property {string} name name name from the capabilites
     * @property {string} logName logName from the capabilities
     *
     * // For mobile
     * @property {string} platformName mobile OS platform to use
     * @property {string} deviceName the kind of mobile device or emulator to use
     * @property {boolean} nativeWebScreenshot  Android can take screenshots of the webview (with Chromedriver) or a complete screenshot (like SauceLabs or Perfecto does)
     *
     * @property {number} devicePixelRatio Ratio of the (vertical) size of one physical pixel on the current display device to the size of one device independent pixels(dips)
     * @property {number} innerHeight innerHeight of the browser
     * @property {number} height Height of the browser
     * @property {number} width Width of the browser
     *
     * @returns {promise}
     * @private
     */
    _getInstanceData() {
        return browser.getProcessedConfig()
            .then(browserConfig => {
                this.browserName = browserConfig.capabilities.browserName ? browserConfig.capabilities.browserName.toLowerCase() : '';
                this.testInBrowser = this.browserName !== '';
                this.name = browserConfig.capabilities.name ? browserConfig.capabilities.name : '';
                this.logName = browserConfig.capabilities.logName ? browserConfig.capabilities.logName : '';

                // Used for mobile
                this.platformName = browserConfig.capabilities.platformName ? browserConfig.capabilities.platformName.toLowerCase() : '';
                this.deviceName = browserConfig.capabilities.deviceName ? browserConfig.capabilities.deviceName.toLowerCase() : '';
                // this.nativeWebScreenshot of the constructor can be overruled by the capabilities when the constructor value is false
                if(!this.nativeWebScreenshot){
                    this.nativeWebScreenshot = browserConfig.capabilities.nativeWebScreenshot ? true : false;
                }

                // Retrieving height / width is different for desktop and mobile
                const windowHeight = this.platformName === '' ? 'window.outerHeight' : 'window.screen.height',
                    windowWidth = this.platformName === '' ? 'window.outerWidth' : 'window.screen.width';

                return browser.driver.executeScript(`return {pixelRatio: window.devicePixelRatio, height: ${windowHeight}, innerHeight: window.innerHeight, width: ${windowWidth}};`)
            })
            .then(browserData => {
                // Firefox creates screenshots in a different way. Although it could be taken on a Retina screen,
                // the screenshot is returned in its original (no factor x is used) dimensions
                this.devicePixelRatio = this._isFirefox() ? this.devicePixelRatio : browserData.pixelRatio;
                this.innerHeight = browserData.innerHeight;
                this.height = browserData.height;
                this.width = browserData.width;
            });
    }

    /**
     * This method returns the position of an element on the screen based on the fact that a screenshot on iOS is a
     * device screenshot including:
     * - statusbar (given default height = 20px) !IMPORTANT The statusbar is visible in the app, but it doesn't effect the
     *   webview height. Checked this with team native
     *   @todo For the iPhone an extra margin needs to be added to the body to make sure the element is below the statusbar
     *   somehow this doesn't always work for the iPad. That's why it it not done for the iPad. If this gives errors on more
     *   projects this needs to be investigated. For now (2016-080-2) it works
     * - navbar (can variate in height in Safari. In Safari is can be max 44px but after scroll it will be smaller. Because
     *   through automation a scrollIntoView is done the navigationbar an button bar are not influenced. A physical scroll
     *   will influence the heights.  The app doesn't has a navbar)
     * - the view
     * - buttonbar (this buttonbar is only visible when the page is not scrolled, it is not visible in the app, by default
     *   it is 44px, not used for determining the position of the element and not present on an iPad)
     * @param {Promise} element The ElementFinder that is used to get the position
     * @returns {Promise} The x/y position of the element
     * @private
     */
    _getIOSPosition(element) {
        function getDataObject(element, addressBar, statusBar) {
            var
                divePixelRatio = window.devicePixelRatio,
                screenHeight = window.screen.height,
                screenWidth = window.screen.width,
                windowInnerHeight = window.innerHeight,
                /* iPad converts screenheight in portraitmode to a incorrect value */
                rotatedScreenHeight = screenHeight > screenWidth ? screenWidth : screenHeight,
                userAgent = window.navigator.userAgent.toLocaleLowerCase(),
                isIPhone = /iphone/.test(userAgent),
                elementPosition,
                y;

            if (screenHeight === windowInnerHeight || rotatedScreenHeight === windowInnerHeight) {
                /* the app */
                /* the statusbar is transparent and over the webview, so add a margin to the body to be sure it on the right position, only for iPhone */
                if (isIPhone) {
                    document.body.style.marginTop = divePixelRatio * statusBar + 'px';
                }
                elementPosition = element.getBoundingClientRect();
                y = elementPosition.top;
            } else {
                /* safari */
                elementPosition = element.getBoundingClientRect();
                y = statusBar + addressBar + elementPosition.top;
            }

            return {
                x: elementPosition.left,
                y: y
            };
        }

        return browser.driver.executeScript(getDataObject, element.getWebElement(), this.iosOffsets.addressBar, this.iosOffsets.statusBar);
    }

    /**
     * Checks if the os is Android
     * @returns {boolean}
     * @private
     */
    _isAndroid() {
        return this.platformName.toLowerCase() === 'android';
    }

    /**
     * Checks if the browser is firefox
     * @returns {boolean}
     * @private
     */
    _isFirefox() {
        return this.browserName === 'firefox';
    }

    /**
     * Checks if the os is ios
     * @returns {boolean}
     * @private
     */
    _isIOS() {
        return this.platformName.toLowerCase() === 'ios';
    }

    /**
     * For Appium and Perfecto the platformName needs to be provided, this will tell if the test is executed on mobile
     * @returns {boolean}
     * @private
     */
    _isMobile() {
        return this.platformName !== '';
    }

    /**
     * Merges non-default options from optionsB into optionsA
     *
     * @method mergeDefaultOptions
     * @param {object} optionsA
     * @param {object} optionsB
     * @return {object}
     * @private
     */
    _mergeDefaultOptions(optionsA, optionsB) {
        optionsB = (typeof optionsB === 'object') ? optionsB : {};

        for (var option in optionsB) {
            if (optionsA.hasOwnProperty(option)) {
                optionsA[option] = optionsB[option];
            }
        }

        return optionsA;
    }

    /**
     * Return the values of an object multiplied against the devicePixelRatio
     * @param {object} values
     * @returns {Object}
     * @private
     */
    _multiplyObjectValuesAgainstDPR(values) {
        Object.keys(values).map(value => {
            values[value] *= this.devicePixelRatio;
        });

        return values;
    }

    /**
     * Runs the comparison against an element
     *
     * @method checkElement
     *
     * @example
     * // default usage
     * browser.protractorImageComparison.checkElement(element(By.id('elementId')), 'imageA');
     * // blockout example
     * browser.protractorImageComparison.checkElement(element(By.id('elementId')), 'imageA', {blockOut: [{x: 10, y: 132, width: 100, height: 50}]});
     * // Add 15 px to top, right, bottom and left when the cut is calculated (it will automatically use the DPR)
     * browser.protractorImageComparison.saveElement(element(By.id('elementId')), 'imageA', {resizeDimensions: 15});
     *
     * @param {Promise} element The ElementFinder that is used to get the position
     * @param {string} tag The tag that is used
     * @param {object} options non-default options
     * @param {object} options.blockOut blockout with x, y, width and height values
     * @param {int} options.resizeDimensions the value to increase the size of the element that needs to be saved
     * @return {Promise} When the promise is resolved it will return the percentage of the difference
     * @public
     */
    checkElement(element, tag, options) {
        const checkOptions = options || [],
            ignoreRectangles = 'blockOut' in checkOptions ? options.blockOut : [];

        return this._getInstanceData()
            .then(() => this.saveElement(element, tag, options))
            .then(() => this._checkImageExists(tag))
            .then(() => {
                const imageComparisonPaths = this._determineImageComparisonPaths(tag);

                return new Promise(resolve => {
                    ResembleJS(imageComparisonPaths.baselineImage)
                        .compareTo(imageComparisonPaths.actualImage)
                        .ignoreRectangles(ignoreRectangles)
                        .onComplete(data => {
                            if (Number(data.misMatchPercentage) > 0) {
                                data.getDiffImage().pack().pipe(fs.createWriteStream(imageComparisonPaths.imageDiffPath));
                            }
                            resolve(Number(data.misMatchPercentage));
                        });
                });
            });
    }

    /**
     * Runs the comparison against the screen
     *
     * @method checkScreen
     *
     * @example
     * // default
     * browser.protractorImageComparison.checkScreen('imageA');
     * // Blockout the statusbar
     * browser.protractorImageComparison.checkScreen('imageA', {blockOutStatusBar: true});
     * // Blockout a given region
     * browser.protractorImageComparison.checkScreen('imageA', {blockOut: [{x: 10, y: 132, width: 100, height: 50}]});
     *
     * @param {string} tag The tag that is used
     * @param {object} options (non-default) options
     * @param {boolean} options.blockOutStatusBar blockout the statusbar yes or no
     * @param {object} options.blockOut blockout with x, y, width and height values, it will override the global
     * @return {Promise} When the promise is resolved it will return the percentage of the difference
     * @public
     */
    checkScreen(tag, options) {
        const checkOptions = options || [],
            blockOutStatusBar = checkOptions.blockOutStatusBar || checkOptions.blockOutStatusBar === false ? checkOptions.blockOutStatusBar : this.blockOutStatusBar;

        let ignoreRectangles = 'blockOut' in checkOptions ? options.blockOut : [];

        return this._getInstanceData()
            .then(() => this.saveScreen(tag))
            .then(() => this._checkImageExists(tag))
            .then(() => {
                const imageComparisonPaths = this._determineImageComparisonPaths(tag);

                if (this._isMobile() && blockOutStatusBar) {
                    console.log('use blockout');
                    const statusBarHeight = this._isAndroid() ? this.androidOffsets.statusBar : this.iosOffsets.statusBar,
                        statusBarBlockOut = this._multiplyObjectValuesAgainstDPR({
                            x: 0,
                            y: 0,
                            height: statusBarHeight,
                            width: this.width
                        });
                    ignoreRectangles.push(statusBarBlockOut);
                }

                return new Promise(resolve => {
                    ResembleJS(imageComparisonPaths.baselineImage)
                        .compareTo(imageComparisonPaths.actualImage)
                        .ignoreRectangles(ignoreRectangles)
                        .onComplete(data => {
                            if (Number(data.misMatchPercentage) > 0) {
                                data.getDiffImage().pack().pipe(fs.createWriteStream(imageComparisonPaths.imageDiffPath));
                            }
                            resolve(Number(data.misMatchPercentage));
                        });
                });
            });
    }

    /**
     * Saves an image of the screen element
     *
     * @method saveElement
     *
     * @example
     * // Default
     * browser.protractorImageComparison.saveElement(element(By.id('elementId')), 'imageA');
     * // Add 15 px to top, right, bottom and left when the cut is calculated (it will automatically use the DPR)
     * browser.protractorImageComparison.saveElement(element(By.id('elementId')), 'imageA', {resizeDimensions: 15});
     *
     * @param {Promise} element The ElementFinder that is used to get the position
     * @param {string} tag The tag that is used
     * @param {object} options (non-default) options
     * @param {int} options.resizeDimensions the value to increase the size of the element that needs to be saved
     * @returns {Promise} The images has been saved when the promise is resolved
     * @public
     */
    saveElement(element, tag, options) {
        let saveOptions = options || [],
            rect,
            bufferedScreenshot;

        this.resizeDimensions = saveOptions.resizeDimensions ? saveOptions.resizeDimensions : this.resizeDimensions;

        return this._getInstanceData()
            .then(()=> browser.takeScreenshot())
            .then(screenshot => {
                bufferedScreenshot = new Buffer(screenshot, 'base64');
                this.screenshotHeight = (bufferedScreenshot.readUInt32BE(20) / this.devicePixelRatio); // width = 16

                return this._determineRectangles(element);
            })
            .then(result => {
                rect = result;
                return new PNGImage({
                    imagePath: bufferedScreenshot,
                    imageOutputPath: path.join(this.actualFolder, this._formatFileName(this.formatString, tag)),
                    cropImage: rect
                }).runWithPromise();
            });
    }

    /**
     * Saves an image of the screen
     *
     * @method saveScreen
     *
     * @example
     * browser.protractorImageComparison.saveScreen('imageA');
     *
     * @param {string} tag The tag that is used
     * @returns {Promise} The images has been saved when the promise is resolved
     * @public
     */
    saveScreen(tag) {
        return this._getInstanceData()
            .then(() => browser.takeScreenshot())
            .then(image => {
                return new PNGImage({
                    imagePath: new Buffer(image, 'base64'),
                    imageOutputPath: path.join(this.actualFolder, this._formatFileName(this.formatString, tag))
                }).runWithPromise();
            });
    }
}

module.exports = protractorImageComparison;
