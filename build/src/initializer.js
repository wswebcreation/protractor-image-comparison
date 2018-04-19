"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const currentInstance_1 = require("./currentInstance");
const constants_1 = require("./constants");
const utils_1 = require("./utils");
function instanceInitializer(args) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const instanceData = yield currentInstance_1.getCurrentInstanceData({
            SAVE_TYPE: constants_1.SAVE_TYPE,
            devicePixelRatio: args.devicePixelRatio,
            testInBrowser: constants_1.TEST_IN_BROWSER,
            nativeWebScreenshot: args.nativeWebScreenshot,
            addressBarShadowPadding: args.addressBarShadowPadding,
            toolBarShadowPadding: args.toolBarShadowPadding
        });
        yield currentInstance_1.setCustomCss({
            addressBarShadowPadding: instanceData.addressBarShadowPadding,
            disableCSSAnimation: args.disableCSSAnimation,
            hideScrollBars: args.hideScrollBars,
            toolBarShadowPadding: instanceData.toolBarShadowPadding
        });
        const fileName = utils_1.formatFileName({
            browserHeight: instanceData.browserHeight,
            browserName: instanceData.browserName,
            browserWidth: instanceData.browserWidth,
            deviceName: instanceData.deviceName,
            devicePixelRatio: instanceData.devicePixelRatio,
            formatString: args.formatString,
            isMobile: utils_1.isMobile(instanceData.platformName),
            name: instanceData.name,
            logName: instanceData.logName,
            tag: args.tag,
            testInBrowser: instanceData.testInBrowser
        });
        return Object.assign({}, instanceData, { fileName });
    });
}
exports.instanceInitializer = instanceInitializer;
//# sourceMappingURL=initializer.js.map