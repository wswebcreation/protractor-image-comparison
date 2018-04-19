"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const protractor_1 = require("protractor");
const camelCase = require('camel-case');
const fs_extra_1 = require("fs-extra");
const assert_1 = require("assert");
const path_1 = require("path");
const PNGImage = require("png-image");
const utils_1 = require("./utils");
class protractorImageComparison {
    constructor(options) {
        assert_1.ok(options.baselineFolder, 'Image baselineFolder not given.');
        assert_1.ok(options.screenshotPath, 'Image screenshotPath not given.');
        this.baselineFolder = path_1.normalize(options.baselineFolder);
        this.baseFolder = path_1.normalize(options.screenshotPath);
        this.debug = options.debug || false;
        this.disableCSSAnimation = options.disableCSSAnimation || false;
        this.hideScrollBars = options.hideScrollBars !== false;
        this.formatString = options.formatImageName || '{tag}-{browserName}-{width}x{height}-dpr-{dpr}';
        this.nativeWebScreenshot = !!options.nativeWebScreenshot;
        this.actualFolder = path_1.join(this.baseFolder, 'actual');
        this.addressBarShadowPadding = 6;
        this.browserHeight = 0;
        this.browserName = '';
        this.browserWidth = 0;
        this.deviceName = '';
        this.diffFolder = path_1.join(this.baseFolder, 'diff');
        this.devicePixelRatio = 1;
        this.logName = '';
        this.name = '';
        this.platformName = '';
        this.screenshotHeight = 0;
        this.tempFullScreenFolder = path_1.join(this.baseFolder, 'tempFullScreen');
        this.saveType = {
            element: false,
            fullPage: false,
            screen: false
        };
        this.testInBrowser = false;
        this.toolBarShadowPadding = 6;
        this.viewPortHeight = 0;
        this.viewPortWidth = 0;
        fs_extra_1.ensureDirSync(this.actualFolder);
        fs_extra_1.ensureDirSync(this.baselineFolder);
        fs_extra_1.ensureDirSync(this.diffFolder);
        if (this.debug) {
            fs_extra_1.ensureDirSync(this.tempFullScreenFolder);
        }
    }
    _getInstanceData() {
        return protractor_1.browser.getProcessedConfig()
            .then(browserConfig => {
            this.browserName = browserConfig.capabilities.browserName ? browserConfig.capabilities.browserName.toLowerCase() : '';
            this.logName = browserConfig.capabilities.logName ? browserConfig.capabilities.logName : '';
            this.name = browserConfig.capabilities.name ? browserConfig.capabilities.name : '';
            this.testInBrowser = this.browserName !== '';
            this.platformName = browserConfig.capabilities.platformName ? browserConfig.capabilities.platformName.toLowerCase() : '';
            this.deviceName = browserConfig.capabilities.deviceName ? browserConfig.capabilities.deviceName.toLowerCase() : '';
            if (!this.nativeWebScreenshot) {
                this.nativeWebScreenshot = !!browserConfig.capabilities.nativeWebScreenshot;
            }
            this.addressBarShadowPadding = (!this.saveType.screen && utils_1.isMobile(this.platformName)
                && this.testInBrowser
                && ((this.nativeWebScreenshot && utils_1.isAndroid(this.platformName)) || utils_1.isIOS(this.platformName)))
                ? this.addressBarShadowPadding
                : 0;
            this.toolBarShadowPadding = (!this.saveType.screen && utils_1.isMobile(this.platformName) && this.testInBrowser && utils_1.isIOS(this.platformName))
                ? this.toolBarShadowPadding
                : 0;
            return this._setCustomTestCSS();
        })
            .then(() => this._getBrowserData());
    }
    _getBrowserData() {
        return protractor_1.browser.driver.executeScript(retrieveData, utils_1.isMobile(this.platformName), this.addressBarShadowPadding, this.toolBarShadowPadding)
            .then((browserData) => {
            this.browserHeight = browserData.height !== 0 ? browserData.height : browserData.viewPortHeight;
            this.browserWidth = browserData.width !== 0 ? browserData.width : browserData.viewPortWidth;
            this.devicePixelRatio = utils_1.isFirefox(this.browserName) ? this.devicePixelRatio : browserData.pixelRatio;
            this.viewPortHeight = browserData.viewPortHeight;
            this.viewPortWidth = browserData.viewPortWidth;
        });
        function retrieveData(isMobile, addressBarShadowPadding, toolBarShadowPadding) {
            return {
                fullPageHeight: document.body.scrollHeight - addressBarShadowPadding - toolBarShadowPadding,
                fullPageWidth: document.body.scrollWidth,
                height: isMobile ? window.screen.height : window.outerHeight,
                pixelRatio: window.devicePixelRatio,
                viewPortWidth: document.body.clientWidth,
                viewPortHeight: window.innerHeight,
                width: isMobile ? window.screen.width : window.outerWidth
            };
        }
    }
    static _mergeDefaultOptions(optionsA, optionsB) {
        optionsB = (typeof optionsB === 'object') ? optionsB : {};
        for (let option in optionsB) {
            if (optionsA.hasOwnProperty(option)) {
                optionsA[option] = optionsB[option];
            }
        }
        return optionsA;
    }
    _setCustomTestCSS() {
        return protractor_1.browser.driver.executeScript(setCSS, this.disableCSSAnimation, this.hideScrollBars, this.addressBarShadowPadding, this.toolBarShadowPadding);
        function setCSS(disableCSSAnimation, hideScrollBars, addressBarShadowPadding, toolBarShadowPadding) {
            var animation = '* {' +
                '-webkit-transition-duration: 0s !important;' +
                'transition-duration: 0s !important;' +
                '-webkit-animation-duration: 0s !important;' +
                'animation-duration: 0s !important;' +
                '}', scrollBar = '*::-webkit-scrollbar { display:none; !important}', bodyTopPadding = addressBarShadowPadding === 0 ? '' : 'body{padding-top:' + addressBarShadowPadding + 'px !important}', bodyBottomPadding = toolBarShadowPadding === 0 ? '' : 'body{padding-bottom:' + toolBarShadowPadding + 'px !important}', css = (disableCSSAnimation ? animation : '') + (hideScrollBars ? scrollBar : '') + bodyTopPadding + bodyBottomPadding, head = document.head || document.getElementsByTagName('head')[0], style = document.createElement('style');
            style.type = 'text/css';
            style.appendChild(document.createTextNode(css));
            head.appendChild(style);
        }
    }
    _multiplyObjectValuesAgainstDPR(values) {
        Object.keys(values).map(value => {
            values[value] *= this.devicePixelRatio;
        });
        return values;
    }
    _saveCroppedScreenshot(bufferedScreenshot, folder, rectangles, tag) {
        return new PNGImage({
            imagePath: bufferedScreenshot,
            imageOutputPath: path_1.join(folder, this._formatFileName(tag)),
            cropImage: rectangles
        }).runWithPromise();
    }
    _formatFileName(tag) {
        let defaults = {
            'browserName': this.browserName,
            'deviceName': this.deviceName,
            'dpr': this.devicePixelRatio,
            'height': this.browserHeight,
            'logName': camelCase(this.logName),
            'mobile': utils_1.isMobile(this.platformName) && this.testInBrowser ? this.browserName : utils_1.isMobile(this.platformName) ? 'app' : '',
            'name': this.name,
            'tag': tag,
            'width': this.browserWidth
        };
        let formatString = this.formatString;
        defaults = protractorImageComparison._mergeDefaultOptions(defaults, {});
        Object.keys(defaults).forEach(function (value) {
            formatString = formatString.replace(`{${value}}`, defaults[value]);
        });
        return formatString + '.png';
    }
    saveScreen(tag, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let saveOptions = options || [];
            this.saveType.screen = true;
            this.disableCSSAnimation = saveOptions.disableCSSAnimation || saveOptions.disableCSSAnimation === false ? saveOptions.disableCSSAnimation : this.disableCSSAnimation;
            return this._getCurrentDriverInstanceData()
                .then(() => protractor_1.browser.takeScreenshot())
                .then((screenshot) => {
                const bufferedScreenshot = new Buffer(screenshot, 'base64');
                this.screenshotHeight = (bufferedScreenshot.readUInt32BE(20) / this.devicePixelRatio);
                const rectangles = this._multiplyObjectValuesAgainstDPR({
                    height: this.screenshotHeight > this.viewPortHeight ? this.screenshotHeight : this.viewPortHeight,
                    width: this.viewPortWidth,
                    x: 0,
                    y: 0
                });
                return this._saveCroppedScreenshot(bufferedScreenshot, this.actualFolder, rectangles, tag);
            });
        });
    }
}
exports.protractorImageComparison = protractorImageComparison;
//# sourceMappingURL=index.js.map
