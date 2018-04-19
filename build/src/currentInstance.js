"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const utils_1 = require("./utils");
const webdriverMethods_1 = require("./webdriverMethods");
function getCurrentInstanceData(args) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const instanceConfig = (yield webdriverMethods_1.getInstanceConfiguration()).capabilities;
        const browserName = (instanceConfig.browserName || '').toLowerCase();
        const logName = instanceConfig.logName || '';
        const name = instanceConfig.name || '';
        const testInBrowser = browserName !== '';
        const platformName = (instanceConfig.platformName || '').toLowerCase();
        const deviceName = (instanceConfig.deviceName || '').toLowerCase();
        const nativeWebScreenshot = !args.nativeWebScreenshot ? !!instanceConfig.nativeWebScreenshot : args.nativeWebScreenshot;
        const testInMobileBrowser = !args.SAVE_TYPE.screen && utils_1.isMobile(platformName) && args.testInBrowser;
        const addressBarShadowPadding = (testInMobileBrowser && ((nativeWebScreenshot && utils_1.isAndroid(platformName)) || utils_1.isIOS(platformName)))
            ? args.addressBarShadowPadding
            : 0;
        const toolBarShadowPadding = (testInMobileBrowser && utils_1.isIOS(platformName)) ? args.toolBarShadowPadding : 0;
        const browserData = yield getBrowserData({
            browserName,
            platformName,
            defaultDevicePixelRatio: args.devicePixelRatio,
            addressBarShadowPadding,
            toolBarShadowPadding
        });
        return Object.assign({ addressBarShadowPadding,
            browserName,
            deviceName,
            logName,
            name,
            nativeWebScreenshot,
            platformName,
            testInBrowser,
            toolBarShadowPadding }, browserData);
    });
}
exports.getCurrentInstanceData = getCurrentInstanceData;
function setCustomCss(args) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        function setCss(args) {
            const animation = '* {' +
                '-webkit-transition-duration: 0s !important;' +
                'transition-duration: 0s !important;' +
                '-webkit-animation-duration: 0s !important;' +
                'animation-duration: 0s !important;' +
                '}', scrollBar = '*::-webkit-scrollbar { display:none; !important}', bodyTopPadding = args.addressBarShadowPadding === 0 ? '' : `body{padding-top: ${args.addressBarShadowPadding}px !important}`, bodyBottomPadding = args.toolBarShadowPadding === 0 ? '' : `body{padding-bottom: ${args.toolBarShadowPadding}px !important}`, css = (args.disableCSSAnimation ? animation : '') + (args.hideScrollBars ? scrollBar : '') + bodyTopPadding + bodyBottomPadding, head = document.head || document.getElementsByTagName('head')[0], style = document.createElement('style');
            style.type = 'text/css';
            style.appendChild(document.createTextNode(css));
            head.appendChild(style);
        }
        return webdriverMethods_1.executeScript(setCss, {
            disableCSSAnimation: args.disableCSSAnimation,
            hideScrollBars: args.hideScrollBars,
            addressBarShadowPadding: args.addressBarShadowPadding,
            toolBarShadowPadding: args.toolBarShadowPadding
        });
    });
}
exports.setCustomCss = setCustomCss;
function getBrowserData(getBrowserDataArguments) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        function retrieveBrowserData(retrieveBrowserDataArguments) {
            const args = retrieveBrowserDataArguments[0];
            const fullPageHeight = document.body.scrollHeight - (args.addressBarShadowPadding + args.toolBarShadowPadding);
            const fullPageWidth = document.body.scrollWidth;
            const devicePixelRatio = args.isFirefox ? args.defaultDevicePixelRatio : window.devicePixelRatio;
            const viewPortWidth = document.body.clientWidth;
            const viewPortHeight = window.innerHeight;
            const height = args.isMobile ? window.screen.height : window.outerHeight;
            const width = args.isMobile ? window.screen.width : window.outerWidth;
            const browserHeight = height !== 0 ? height : viewPortHeight;
            const browserWidth = width !== 0 ? width : viewPortWidth;
            return {
                browserHeight,
                browserWidth,
                devicePixelRatio,
                fullPageHeight,
                fullPageWidth,
                viewPortHeight,
                viewPortWidth
            };
        }
        return webdriverMethods_1.executeScript(retrieveBrowserData, {
            addressBarShadowPadding: getBrowserDataArguments.addressBarShadowPadding,
            defaultDevicePixelRatio: getBrowserDataArguments.defaultDevicePixelRatio,
            isFirefox: utils_1.isFirefox(getBrowserDataArguments.browserName),
            isMobile: utils_1.isMobile(getBrowserDataArguments.platformName),
            toolBarShadowPadding: getBrowserDataArguments.toolBarShadowPadding
        });
    });
}
//# sourceMappingURL=currentInstance.js.map