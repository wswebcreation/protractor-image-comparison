"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const getScreenDimensions_1 = require("../scripts/getScreenDimensions");
const utils_1 = require("../utils/utils");
const screenshotInitializer_1 = require("../modules/screenshotInitializer");
const screenshotReset_1 = require("../modules/screenshotReset");
function default_1(executor, getInstanceData, takeScreenshot, tag, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const instanceData = yield getInstanceData();
        const enrichedInstanceData = utils_1.enrichInstanceData({
            addressBarShadowPadding: options.addressBarShadowPadding,
            nativeWebScreenshot: options.nativeWebScreenshot,
            toolBarShadowPadding: options.toolBarShadowPadding
        }, instanceData);
        const browserdata = yield executor(getScreenDimensions_1.default);
        yield screenshotInitializer_1.default(executor, {
            addressBarShadowPadding: options.addressBarShadowPadding,
            disableCSSAnimation: options.disableCSSAnimation,
            hideScrollBars: options.hideScrollBars,
            toolBarShadowPadding: options.toolBarShadowPadding
        });
        const screenshot = yield takeScreenshot();
        yield screenshotReset_1.default(executor);
        if (options.debug) {
            console.log('\n######################## SAVE SCREEN ########################');
            console.log('instanceData = ', instanceData);
            console.log('==============================================================');
            console.log('enrichedInstanceData = ', enrichedInstanceData);
            console.log('==============================================================');
            console.log('browserdata = ', browserdata);
            console.log('######################## SAVE SCREEN ########################\n');
        }
        return Promise.resolve('done');
    });
}
exports.default = default_1;
//# sourceMappingURL=saveScreen.js.map