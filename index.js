'use strict';

const assert = require('assert'),
    camelCase = require('camel-case'),
    fs = require('fs'),
    mkdirp = require('mkdirp'),
    path = require('path'),
    PNGImage = require('png-image'),
    PNGJSImage = require('pngjs-image'),
    ResembleJS = require('./lib/resemble');

/**
 * image-diff protractor plugin class
 *
 * @constructor
 * @class protractorImageComparison
 * @param {object} options
 * @param {string} options.baselineFolder Path to the baseline folder
 * @param {string} options.screenshotPath Path to the folder where the screenshots are saved
 * @param {boolean} options.debug Add some extra logging and always save the image difference (default:false)
 * @param {string} options.formatImageOptions Custom variables for Image Name (default:{tag}-{browserName}-{width}x{height}-dpr-{dpr})
 * @param {boolean} options.disableCSSAnimation Disable all css animations on a page (default:false)
 * @param {boolean} options.nativeWebScreenshot If a native screenshot of a device (complete screenshot) needs to be taken (default:false)
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
 * @property {string} tempFullScreenFolder Path where the temporary fullscreens are saved
 * @property {int} fullPageScrollTimeout Default timeout to wait after a scroll
 */

class protractorImageComparison {
    constructor(options) {
        assert.ok(options.baselineFolder, 'Image baselineFolder not given.');
        assert.ok(options.screenshotPath, 'Image screenshotPath not given.');

        this.baselineFolder = path.normalize(options.baselineFolder);
        this.baseFolder = path.normalize(options.screenshotPath);
        this.debug = options.debug || false;
        this.formatString = options.formatImageName || '{tag}-{browserName}-{width}x{height}-dpr-{dpr}';
        this.disableCSSAnimation = options.disableCSSAnimation || false;

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

        this.tempFullScreenFolder = path.join(this.baseFolder, 'tempFullScreen');
        this.fullPageScrollTimeout = 1000;

        if (!fs.existsSync(this.diffFolder) || !fs.statSync(this.diffFolder).isDirectory()) {
            mkdirp.sync(this.diffFolder);
        }

        if (!fs.existsSync(this.baselineFolder) || !fs.statSync(this.baselineFolder).isDirectory()) {
            mkdirp.sync(this.baselineFolder);
        }

        if (!fs.existsSync(this.actualFolder) || !fs.statSync(this.actualFolder).isDirectory()) {
            mkdirp.sync(this.actualFolder);
        }

        if (!fs.existsSync(this.tempFullScreenFolder) || !fs.statSync(this.tempFullScreenFolder).isDirectory()) {
            mkdirp.sync(this.tempFullScreenFolder);
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
     * Compose a full page screenshot and save it
     * @param {string} tag The tag that is used
     * @param {number} parts The amount of parts that need to be processed
     * @param {number} part The current part of the screenshot that is being processed
     * @param {string} image The current image output that needs to be saved
     * @returns {Promise}
     * @private
     */
    _composeAndSaveFullScreenshot(tag, parts, part, image) {
        const imageHeight = this.fullPageHeight * this.devicePixelRatio;
        const imageWidth = this.fullPageWidth * this.devicePixelRatio;
        const height = this.innerHeight * (part - 1) * this.devicePixelRatio;

        let imageOutput = image || null;

        if (part === 1) {
            imageOutput = PNGJSImage.createImage(imageWidth, imageHeight);
        } else if (part > parts) {
            return new Promise(resolve => {
                imageOutput.writeImageSync(path.join(this.actualFolder, this._formatFileName(this.formatString, tag)));
                resolve();
            });
        }

        const stitchImage = PNGJSImage.readImageSync(path.join(this.tempFullScreenFolder, this._formatFileName(this.formatString, `${tag}-${part}`)));
        stitchImage.getImage().bitblt(imageOutput.getImage(), 0, 0, stitchImage.getWidth(), stitchImage.getHeight(), 0, height);

        return this._composeAndSaveFullScreenshot(tag, parts, part + 1, imageOutput)
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
                } else if (((y - this.resizeDimensions) + height + 2 * this.resizeDimensions) > this.height) {
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
     * @property {number} fullPageHeight fullPageHeight of the browser
     * @property {number} fullPageWidth fullPageWidth of the browser
     * @property {number} innerHeight innerHeight of the browser
     * @property {number} clientWidth width of the browser without the vertical scrollbar
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
                if (!this.nativeWebScreenshot) {
                    this.nativeWebScreenshot = browserConfig.capabilities.nativeWebScreenshot ? true : false;
                }

                return browser.driver.executeScript(setCSSAndRetrieveBrowserData, this.platformName, this.disableCSSAnimation);

                // Platform name is used for determining height / width which is different for desktop and mobile
                function setCSSAndRetrieveBrowserData(platformName, disableCSSAnimation) {
                    var animation = '* {' +
                            '-webkit-transition-duration: 0s !important;' +
                            'transition-duration: 0s !important;' +
                            '-webkit-animation-duration: 0s !important;' +
                            'animation-duration: 0s !important;' +
                            '}',
                        scrollBar = '*::-webkit-scrollbar { -webkit-appearance: none;}',
                        css = disableCSSAnimation ? scrollBar + animation : scrollBar,
                        head = document.head || document.getElementsByTagName('head')[0],
                        style = document.createElement('style');

                    style.type = 'text/css';
                    style.appendChild(document.createTextNode(css));
                    head.appendChild(style);

                    return {
                        clientWidth: document.body.clientWidth,
                        fullPageHeight: document.body.scrollHeight,
                        fullPageWidth: document.body.scrollWidth,
                        height: platformName === '' ? window.outerHeight : window.screen.height,
                        innerHeight: window.innerHeight,
                        pixelRatio: window.devicePixelRatio,
                        width: platformName === '' ? window.outerWidth : window.screen.width
                    };
                }
            })
            .then(browserData => {
                // Firefox creates screenshots in a different way. Although it could be taken on a Retina screen,
                // the screenshot is returned in its original (no factor x is used) dimensions
                this.devicePixelRatio = this._isFirefox() ? this.devicePixelRatio : browserData.pixelRatio;
                this.fullPageHeight = browserData.fullPageHeight;
                this.fullPageWidth = browserData.fullPageWidth;
                this.innerHeight = browserData.innerHeight;
                this.clientWidth = browserData.clientWidth;
                this.height = browserData.height;
                this.width = browserData.width;
            });
    }

    /**
     * This method returns the position of an element on the screen based on the fact that a screenshot on iOS is a
     * device screenshot including:
     * - statusbar (given default height = 20px)
     * - addressbar (can variate in height in Safari. In Safari is can be max 44px but after scroll it will be smaller. Because
     *   through automation a scrollIntoView is done the navigationbar an button bar are not influenced. A physical scroll
     *   will influence the heights.  The app doesn't has a navbar)
     * - the viewpot
     * - toolbar (this buttonbar is only visible when the page is not scrolled, it is not visible in the app, by default
     *   it is 44px, not used for determining the position of the element and not present on an iPad)
     * @param {Promise} element The ElementFinder that is used to get the position
     * @returns {Promise} The x/y position of the element
     * @private
     */
    _getIOSPosition(element) {
        function getDataObject(element, addressBar, statusBar) {
            var screenHeight = window.screen.height,
                screenWidth = window.screen.width,
                windowInnerHeight = window.innerHeight,
                /* iPad converts screenheight in portraitmode to a incorrect value */
                rotatedScreenHeight = screenHeight > screenWidth ? screenWidth : screenHeight,
                elementPosition,
                y;

            if (screenHeight === windowInnerHeight || rotatedScreenHeight === windowInnerHeight) {
                /* the app */
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
     * Save a cropped screenshot
     * @param {string} bufferedScreenshot a new Buffer screenshot
     * @param {string} folder path of the folder where the image needs to be saved
     * @param {object} rectangles x, y, height and width data to determine the crop
     * @param {string} tag The tag that is used
     * @returns {Promise} The image has been saved when the promise is resoled
     * @private
     */
    _saveCroppedScreenshot(bufferedScreenshot, folder, rectangles, tag) {
        return new PNGImage({
            imagePath: bufferedScreenshot,
            imageOutputPath: path.join(folder, this._formatFileName(this.formatString, tag)),
            cropImage: rectangles
        }).runWithPromise();
    }

    /**
     * Takes a screenshot and saves it with a given tag
     * @param {string} folder the path to the folder to save the image to
     * @param {string} tag The tag that is used
     * @returns {Promise} The images has been saved when the promise is resolved
     * @private
     */
    _saveScreenshot(folder, tag) {
        return browser.takeScreenshot()
            .then(image => {
                return new PNGImage({
                    imagePath: new Buffer(image, 'base64'),
                    imageOutputPath: path.join(folder, this._formatFileName(this.formatString, tag))
                }).runWithPromise();
            });
    }

    /**
     * Scroll to static horizontal and a given vertical coordinate on the page and return the current size of the screen
     * @param {number} verticalCoordinate The y-coordinate that needs to be scrolled to
     * @returns {Promise}
     * @private
     */
    _scrollToAndDetermineFullPageHeight(verticalCoordinate) {
        return browser.driver.executeAsyncScript(_scrollAndReturnFullPageHeight, verticalCoordinate, this.fullPageScrollTimeout);

        function _scrollAndReturnFullPageHeight(y, timeout, done) {
            var intervalId;

            window.scrollTo(0, y);
            intervalId = setTimeout(function () {
                clearInterval(intervalId);
                done(document.body.scrollHeight);
            }, timeout);
        }

    }

    /**
     * Scroll to a given vertical coordinate and save the screenshot
     * @param {number} verticalCoordinate The vertical coordinate that needs to be scrolled to
     * @param {string} tag The tag that is used
     * @param {number} part The part of the screen that is being processed
     * @returns {Promise}
     * @private
     */
    _scrollAndSave(verticalCoordinate, tag, part) {
        const currentVerticalCoordinate = (part - 1) * this.innerHeight;

        let actualFullPageHeight;
        let isLastScreenshot;

        return this._scrollToAndDetermineFullPageHeight(verticalCoordinate)
            .then(height => {
                actualFullPageHeight = height;
                return browser.takeScreenshot()
            })
            .then(screenshot => {
                const bufferedScreenshot = new Buffer(screenshot, 'base64');
                this.screenshotHeight = (bufferedScreenshot.readUInt32BE(20) / this.devicePixelRatio); // width = 16

                // For older webdriver of Firefox and IE11, they make "fullpage" screenshots
                const isLargeScreenshot = this.screenshotHeight > this.innerHeight;

                // Determine current fullpageheight
                if (isLargeScreenshot) {
                    this.fullPageHeight = this.screenshotHeight;
                } else {
                    // Value can be equal, or bigger due to for example lazyloading
                    this.fullPageHeight = actualFullPageHeight;
                }

                // Determine the crop height and postion from where to crop
                isLastScreenshot = this.innerHeight * part > this.fullPageHeight;
                const cropHeight = isLastScreenshot ? this.fullPageHeight - currentVerticalCoordinate : this.innerHeight;
                let cropTopPosition = isLastScreenshot ? this.innerHeight - cropHeight : 0;

                // large image screenshot
                if (isLargeScreenshot) {
                    cropTopPosition = isLastScreenshot ? currentVerticalCoordinate : verticalCoordinate;
                }

                const rectangles = this._multiplyObjectValuesAgainstDPR({
                    height: cropHeight,
                    width: this.clientWidth,
                    x: 0,
                    y: cropTopPosition
                });

                if (this.debug) {
                    console.log('\n####################################################');
                    console.log('OLD fullPageHeight = ', actualFullPageHeight);
                    console.log('NEW fullPageHeight = ', this.fullPageHeight);
                    console.log('this.screenshotHeight = ', this.screenshotHeight);
                    console.log('currentVerticalCoordinate = ', currentVerticalCoordinate);
                    console.log('verticalCoordinate = ', verticalCoordinate);
                    console.log('trying part =', part);
                    console.log(`this.innerHeight * part > this.fullPageHeight = ${this.innerHeight * part} > ${this.fullPageHeight}`);
                    console.log('cropHeight = ', cropHeight);
                    console.log('cropTopPosition = ', cropTopPosition);
                    console.log('rectangles =', rectangles);
                    console.log('####################################################\n');
                }

                return this._saveCroppedScreenshot(bufferedScreenshot, this.tempFullScreenFolder, rectangles, `${tag}-${part}`)
            })
            // Or compose and save the screenshot, or scroll and save again
            .then(() => isLastScreenshot ? this._composeAndSaveFullScreenshot(tag, part, 1) : this._scrollAndSave(this.innerHeight * part, tag, part + 1));
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
     * // Disable css animation on all elements
     * browser.protractorImageComparison.saveElement(element(By.id('elementId')), 'imageA', {disableCSSAnimation: true});
     *
     * @param {Promise} element The ElementFinder that is used to get the position
     * @param {string} tag The tag that is used
     * @param {object} options non-default options
     * @param {object} options.blockOut blockout with x, y, width and height values
     * @param {int} options.resizeDimensions the value to increase the size of the element that needs to be saved
     * @param {boolean} options.disableCSSAnimation enable or disable CSS animation
     * @return {Promise} When the promise is resolved it will return the percentage of the difference
     * @public
     */
    checkElement(element, tag, options) {
        const checkOptions = options || [],
            ignoreRectangles = 'blockOut' in checkOptions ? options.blockOut : [];

        return this.saveElement(element, tag, checkOptions)
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
     * Runs the comparison against the fullpage screenshot
     *
     * @method checkFullPageScreenshot
     *
     * @example
     * // default
     * browser.protractorImageComparison.checkFullPageScreenshot('imageA');
     * // Blockout the statusbar
     * browser.protractorImageComparison.checkFullPageScreenshot('imageA', {blockOutStatusBar: true});
     * // Blockout a given region
     * browser.protractorImageComparison.checkFullPageScreenshot('imageA', {blockOut: [{x: 10, y: 132, width: 100, height: 50}]});
     * // Disable css animation on all elements
     * browser.protractorImageComparison.checkFullPageScreenshot('imageA', {disableCSSAnimation: true});
     * // Add timeout between scrolling and taking a screenshot
     * browser.protractorImageComparison.checkFullPageScreenshot('imageA',{fullPageScrollTimeout: 5000});
     *
     * @param {string} tag The tag that is used
     * @param {object} options (non-default) options
     * @param {boolean} options.blockOutStatusBar blockout the statusbar yes or no
     * @param {object} options.blockOut blockout with x, y, width and height values, it will override the global
     * @param {boolean} options.disableCSSAnimation enable or disable CSS animation
     * @param {int} options.fullPageScrollTimeout The time that needs to be waited when scrolling to a point and save the screenshot
     * @return {Promise} When the promise is resolved it will return the percentage of the difference
     * @public
     */
    checkFullPageScreenshot(tag, options) {
        const checkOptions = options || [];

        return this.saveFullPageScreenshot(tag, checkOptions)
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
            })
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
     * // Disable css animation on all elements
     * browser.protractorImageComparison.checkScreen('imageA', {disableCSSAnimation: true});
     *
     * @param {string} tag The tag that is used
     * @param {object} options (non-default) options
     * @param {boolean} options.blockOutStatusBar blockout the statusbar yes or no
     * @param {object} options.blockOut blockout with x, y, width and height values, it will override the global
     * @param {boolean} options.disableCSSAnimation enable or disable CSS animation
     * @return {Promise} When the promise is resolved it will return the percentage of the difference
     * @public
     */
    checkScreen(tag, options) {
        const checkOptions = options || [],
            blockOutStatusBar = checkOptions.blockOutStatusBar || checkOptions.blockOutStatusBar === false ? checkOptions.blockOutStatusBar : this.blockOutStatusBar;

        let ignoreRectangles = 'blockOut' in checkOptions ? options.blockOut : [];

        return this.saveScreen(tag, checkOptions)
            .then(() => this._checkImageExists(tag))
            .then(() => {
                const imageComparisonPaths = this._determineImageComparisonPaths(tag);

                if (this._isMobile() && blockOutStatusBar) {
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
     * // Disable css animation on all elements
     * browser.protractorImageComparison.saveElement(element(By.id('elementId')), 'imageA', {disableCSSAnimation: true});
     *
     * @param {Promise} element The ElementFinder that is used to get the position
     * @param {string} tag The tag that is used
     * @param {object} options (non-default) options
     * @param {int} options.resizeDimensions the value to increase the size of the element that needs to be saved
     * @param {boolean} options.disableCSSAnimation enable or disable CSS animation
     * @returns {Promise} The images has been saved when the promise is resolved
     * @public
     */
    saveElement(element, tag, options) {
        let saveOptions = options || [],
            bufferedScreenshot;

        this.resizeDimensions = saveOptions.resizeDimensions ? saveOptions.resizeDimensions : this.resizeDimensions;
        this.disableCSSAnimation = saveOptions.disableCSSAnimation || saveOptions.disableCSSAnimation === false ? saveOptions.disableCSSAnimation : this.disableCSSAnimation;

        return this._getInstanceData()
            .then(()=> browser.takeScreenshot())
            .then(screenshot => {
                bufferedScreenshot = new Buffer(screenshot, 'base64');
                this.screenshotHeight = (bufferedScreenshot.readUInt32BE(20) / this.devicePixelRatio); // width = 16

                return this._determineRectangles(element);
            })
            .then(rectangles => this._saveCroppedScreenshot(bufferedScreenshot, this.actualFolder, rectangles, tag));
    }

    /**
     * Saves a full page image of the screen
     *
     * @method saveFullPageScreenshot
     *
     * @example
     * // Default
     * browser.protractorImageComparison.saveFullPageScreenshot('imageA');
     * // Disable css animation on all elements
     * browser.protractorImageComparison.saveFullPageScreenshot('imageA',{disableCSSAnimation: true});
     * // Add timeout between scrolling and taking a screenshot
     * browser.protractorImageComparison.saveFullPageScreenshot('imageA',{fullPageScrollTimeout: 5000});
     *
     * @param {string} tag The tag that is used
     * @param {object} options (non-default) options
     * @param {int} options.fullPageScrollTimeout The time that needs to be waited when scrolling to a point and save the screenshot
     * @param {boolean} options.disableCSSAnimation enable or disable CSS animation
     * @returns {Promise} The image has been saved when the promise is resolved
     * @public
     */
    saveFullPageScreenshot(tag, options) {
        let saveOptions = options || [];

        this.fullPageScrollTimeout = saveOptions.fullPageScrollTimeout && parseInt(saveOptions.fullPageScrollTimeout, 10) > this.fullPageScrollTimeout ? saveOptions.fullPageScrollTimeout : this.fullPageScrollTimeout;
        this.disableCSSAnimation = saveOptions.disableCSSAnimation || saveOptions.disableCSSAnimation === false ? saveOptions.disableCSSAnimation : this.disableCSSAnimation;

        // Start scrolling at y=0
        return this._getInstanceData()
            .then(()=> this._scrollAndSave(0, tag, 1));
    }

    /**
     * Saves an image of the screen
     *
     * @method saveScreen
     *
     * @example
     * // Default
     * browser.protractorImageComparison.saveScreen('imageA');
     * // Disable css animation on all elements
     * browser.protractorImageComparison.saveScreen('imageA',{disableCSSAnimation: true});
     *
     * @param {string} tag The tag that is used
     * @param {object} options (non-default) options
     * @param {boolean} options.disableCSSAnimation enable or disable CSS animation
     * @returns {Promise} The image has been saved when the promise is resolved
     * @public
     */
    saveScreen(tag, options) {
        let saveOptions = options || [];

        this.disableCSSAnimation = saveOptions.disableCSSAnimation || saveOptions.disableCSSAnimation === false ? saveOptions.disableCSSAnimation : this.disableCSSAnimation;

        return this._getInstanceData()
            .then(() => this._saveScreenshot(this.actualFolder, tag));
    }
}

module.exports = protractorImageComparison;
