"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_extra_1 = require("fs-extra");
const assert_1 = require("assert");
const path_1 = require("path");
const utils_1 = require("./utils");
const constants_1 = require("./constants");
const initOptions_1 = require("./initOptions");
const image_1 = require("./image");
const initializer_1 = require("./initializer");
class protractorImageComparison {
    constructor(options) {
        assert_1.ok(options.baselineFolder, 'Image baselineFolder not given.');
        assert_1.ok(options.screenshotPath, 'Image screenshotPath not given.');
        const baseFolder = path_1.normalize(options.screenshotPath);
        this.folders = {
            actualFolder: path_1.join(baseFolder, constants_1.ACTUAL_FOLDER),
            baselineFolder: path_1.normalize(options.baselineFolder),
            baseFolder: path_1.normalize(options.screenshotPath),
            diffFolder: path_1.join(baseFolder, constants_1.DIFF_FOLDER),
            tempFullScreenFolder: path_1.join(baseFolder, constants_1.TEMP_FULLSCREENSHOT_FOLDER)
        };
        this.autoSaveBaseline = options.autoSaveBaseline || constants_1.AUTO_SAVE_BASELINE;
        this.debug = options.debug || constants_1.DEBUG;
        this.disableCSSAnimation = options.disableCSSAnimation || constants_1.DISABLE_CSS_ANIMATION;
        this.hideScrollBars = options.hideScrollBars !== constants_1.HIDE_SCROLLBARS;
        this.formatString = options.formatImageName || constants_1.DEFAULT_FILE_FORMAT_STRING;
        this.nativeWebScreenshot = !!options.nativeWebScreenshot;
        this.blockOutStatusBar = !!options.blockOutStatusBar;
        this.ignoreAntialiasing = options.ignoreAntialiasing || constants_1.IGNORE_ANTIALIASING;
        this.ignoreColors = options.ignoreColors || constants_1.IGNORE_COLORS;
        this.ignoreTransparentPixel = options.ignoreTransparentPixel || constants_1.IGNORE_TRANSPARENT_PIXEL;
        let androidOffsets = options.androidOffsets && typeof options.androidOffsets === 'object' ? options.androidOffsets : {};
        let iosOffsets = options.iosOffsets && typeof options.iosOffsets === 'object' ? options.iosOffsets : {};
        let androidDefaultOffsets = {
            statusBar: 24,
            addressBar: 56,
            addressBarScrolled: 0,
            toolBar: 48
        };
        let iosDefaultOffsets = {
            statusBar: 20,
            addressBar: 44,
            addressBarScrolled: 19,
            toolBar: 44
        };
        this.addressBarShadowPadding = 6;
        this.androidOffsets = Object.assign({}, androidDefaultOffsets, androidOffsets);
        this.devicePixelRatio = 1;
        this.iosOffsets = Object.assign({}, iosDefaultOffsets, iosOffsets);
        this.toolBarShadowPadding = 6;
        fs_extra_1.ensureDirSync(this.folders.actualFolder);
        fs_extra_1.ensureDirSync(this.folders.baselineFolder);
        fs_extra_1.ensureDirSync(this.folders.diffFolder);
        if (this.debug) {
            fs_extra_1.ensureDirSync(this.folders.tempFullScreenFolder);
        }
    }
    checkScreen(tag, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const checkScreenOptions = initOptions_1.initCheckScreenOptions(this.blockOutStatusBar, this.disableCSSAnimation, this.hideScrollBars, this.ignoreAntialiasing, this.ignoreColors, this.ignoreTransparentPixel, options);
            constants_1.SAVE_TYPE.screen = true;
            const testInstanceData = yield initializer_1.instanceInitializer({
                addressBarShadowPadding: this.addressBarShadowPadding,
                devicePixelRatio: this.devicePixelRatio,
                disableCSSAnimation: checkScreenOptions.disableCSSAnimation,
                hideScrollBars: checkScreenOptions.hideScrollBars,
                formatString: this.formatString,
                nativeWebScreenshot: this.nativeWebScreenshot,
                SAVE_TYPE: constants_1.SAVE_TYPE,
                tag,
                testInBrowser: constants_1.TEST_IN_BROWSER,
                toolBarShadowPadding: this.toolBarShadowPadding
            });
            yield this.saveScreen(tag, {
                disableCSSAnimation: checkScreenOptions.disableCSSAnimation,
                hideScrollBars: this.hideScrollBars
            }, testInstanceData);
            image_1.checkImageExists(Object.assign({ autoSaveBaseline: this.autoSaveBaseline }, this.folders, { fileName: testInstanceData.fileName }));
            return image_1.executeImageComparison({
                blockOutStatusBar: this.blockOutStatusBar,
                debug: this.debug,
                compareOptions: checkScreenOptions,
                offsets: {
                    android: this.androidOffsets,
                    ios: this.iosOffsets
                },
                folders: this.folders,
                testInstanceData
            });
        });
    }
    saveScreen(tag, options, testInstance) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const saveScreenOptions = initOptions_1.initSaveScreenOptions(this.disableCSSAnimation, this.hideScrollBars, options);
            constants_1.SAVE_TYPE.screen = true;
            const testInstanceData = testInstance || (yield initializer_1.instanceInitializer({
                addressBarShadowPadding: this.addressBarShadowPadding,
                devicePixelRatio: this.devicePixelRatio,
                disableCSSAnimation: saveScreenOptions.disableCSSAnimation,
                hideScrollBars: saveScreenOptions.hideScrollBars,
                formatString: this.formatString,
                nativeWebScreenshot: this.nativeWebScreenshot,
                SAVE_TYPE: constants_1.SAVE_TYPE,
                tag,
                testInBrowser: constants_1.TEST_IN_BROWSER,
                toolBarShadowPadding: this.toolBarShadowPadding
            }));
            const bufferedScreenshot = yield utils_1.getBufferedScreenshot();
            const screenshotHeight = (bufferedScreenshot.readUInt32BE(20) / testInstanceData.devicePixelRatio);
            const rectangles = utils_1.calculateDprRectangles({
                height: screenshotHeight > testInstanceData.viewPortHeight ? screenshotHeight : testInstanceData.viewPortHeight,
                width: testInstanceData.viewPortWidth,
                x: 0,
                y: 0
            }, testInstanceData.devicePixelRatio);
            yield image_1.saveCroppedScreenshot({
                bufferedScreenshot,
                fileName: testInstanceData.fileName,
                folder: this.folders.actualFolder,
                rectangles
            });
        });
    }
}
exports.protractorImageComparison = protractorImageComparison;
//# sourceMappingURL=index.js.map