"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const utils_1 = require("./utils");
const webdriverMethods_1 = require("./webdriverMethods");
const protractor_1 = require("protractor");
function getBrowserData(args) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        function retrieveBrowserData(args) {
            const fullPageHeight = document.body.scrollHeight - args.addressBarShadowPadding - args.toolBarShadowPadding;
            const fullPageWidth = document.body.scrollWidth;
            const height = args.isMobile ? window.screen.height : window.outerHeight;
            const pixelRatio = window.devicePixelRatio;
            const viewPortWidth = document.body.clientWidth;
            const viewPortHeight = window.innerHeight;
            const width = args.isMobile ? window.screen.width : window.outerWidth;
            return {
                browserHeight: height !== 0 ? height : viewPortHeight,
                browserWidth: width !== 0 ? width : viewPortWidth,
                devicePixelRatio: args.isFirefox ? args.defaultDevicePixelRatio : pixelRatio,
                fullPageHeight: fullPageHeight,
                fullPageWidth: fullPageWidth,
                viewPortHeight: viewPortHeight,
                viewPortWidth: viewPortWidth
            };
        }
        return webdriverMethods_1.executeScript(retrieveBrowserData, {
            addressBarShadowPadding: args.addressBarShadowPadding,
            defaultDevicePixelRatio: args.defaultDevicePixelRatio,
            isFirefox: utils_1.isFirefox(args.browserName),
            isMobile: utils_1.isMobile(args.platformName),
            toolBarShadowPadding: args.toolBarShadowPadding
        });
    });
}
function getCurrentInstanceData(args) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const instanceConfig = (yield protractor_1.browser.getProcessedConfig()).capabilities;
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
            defaultDevicePixelRatio: args.defaultDevicePixelRatio,
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
//# sourceMappingURL=instanceData.js.map