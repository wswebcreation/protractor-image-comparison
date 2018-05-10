"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
function platformIsAndroid(platformName) {
    return platformName.toLowerCase() === constants_1.PLATFORMS.ANDROID;
}
exports.platformIsAndroid = platformIsAndroid;
function platformIsIos(platformName) {
    return platformName.toLowerCase() === constants_1.PLATFORMS.IOS;
}
exports.platformIsIos = platformIsIos;
function enrichInstanceData(options, instanceData) {
    const isAndroid = platformIsAndroid(instanceData.platformName);
    const isIos = platformIsIos(instanceData.platformName);
    const isMobile = instanceData.platformName !== '';
    const testInBrowser = instanceData.browserName !== '';
    const testInMobileBrowser = isMobile && testInBrowser;
    const isNativeWebScreenshot = !options.nativeWebScreenshot ? !!instanceData.nativeWebScreenshot : options.nativeWebScreenshot;
    const addressBarShadowPadding = (testInMobileBrowser && ((isNativeWebScreenshot && isAndroid) || isIos)) ? options.addressBarShadowPadding : 0;
    const toolBarShadowPadding = (testInMobileBrowser && isIos) ? options.toolBarShadowPadding : 0;
    return Object.assign({}, (instanceData), { addressBarShadowPadding,
        isAndroid,
        isIos,
        isMobile,
        isNativeWebScreenshot,
        testInBrowser,
        testInMobileBrowser,
        toolBarShadowPadding });
}
exports.enrichInstanceData = enrichInstanceData;
//# sourceMappingURL=utils.js.map