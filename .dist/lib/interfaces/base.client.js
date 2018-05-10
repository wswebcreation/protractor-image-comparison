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
const path_1 = require("path");
const assert = require("assert");
const constants_1 = require("../constants");
const saveScreen_1 = require("../commands/saveScreen");
class BaseImageComparisonClient {
    constructor(options) {
        assert.ok(options.baselineFolder, 'Image baselineFolder not given.');
        assert.ok(options.screenshotPath, 'Image screenshotPath not given.');
        this.autoSaveBaseline = options.autoSaveBaseline || false;
        this.baselineFolder = path_1.normalize(options.baselineFolder);
        this.baseFolder = path_1.normalize(options.screenshotPath);
        this.debug = !!options.debug;
        this.disableCSSAnimation = !!options.disableCSSAnimation;
        this.formatString = options.formatImageName || constants_1.DEFAULT_FORMAT_STRING;
        this.hideScrollBars = options.hideScrollBars !== false;
        this.nativeWebScreenshot = !!options.nativeWebScreenshot;
        this.addressBarShadowPadding = 6;
        this.toolBarShadowPadding = 6;
    }
    saveScreen(tag, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return saveScreen_1.default(this.executeClientScript, this.getInstanceData, this.takeScreenshot, tag, Object.assign({ addressBarShadowPadding: this.addressBarShadowPadding, debug: this.debug, disableCSSAnimation: this.disableCSSAnimation, hideScrollBars: this.hideScrollBars, nativeWebScreenshot: this.nativeWebScreenshot, toolBarShadowPadding: this.toolBarShadowPadding }, (options)));
        });
    }
}
exports.BaseImageComparisonClient = BaseImageComparisonClient;
//# sourceMappingURL=base.client.js.map