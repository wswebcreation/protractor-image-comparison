"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const PNGImage = require("png-image");
const utils_1 = require("./utils");
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const resembleJS = require("./lib/resemble");
function saveCroppedScreenshot(args) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return new PNGImage({
            imagePath: args.bufferedScreenshot,
            imageOutputPath: path_1.join(args.folder, args.fileName),
            cropImage: args.rectangles
        }).runWithPromise();
    });
}
exports.saveCroppedScreenshot = saveCroppedScreenshot;
function checkImageExists(imageData) {
    if (!fs_extra_1.pathExistsSync(path_1.join(imageData.baselineFolder, imageData.fileName))) {
        if (imageData.autoSaveBaseline) {
            try {
                fs_extra_1.copySync(path_1.join(imageData.actualFolder, imageData.fileName), path_1.join(imageData.baselineFolder, imageData.fileName));
                console.log(`\nINFO: Autosaved the image to ${path_1.join(imageData.baselineFolder, imageData.fileName)}\n`);
            }
            catch (error) {
                throw new Error(`Image could not be copied. The following error was thrown: ${error}`);
            }
        }
        else {
            throw new Error('Image not found, if you want to save the image as a new baseline image please provide `autoSaveBaseline: true`.');
        }
    }
}
exports.checkImageExists = checkImageExists;
function executeImageComparison(args) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const imageComparisonPaths = utils_1.determineImageComparisonPaths(Object.assign({}, args.folders, { fileName: args.testInstanceData.fileName }));
        const ignoreRectangles = !!args.compareOptions.blockOut ? args.compareOptions.blockOut : [];
        const blockOutStatusBar = !!args.compareOptions.blockOutStatusBar ? args.blockOutStatusBar : args.compareOptions.blockOutStatusBar;
        args.compareOptions.ignoreRectangles = !!args.compareOptions.ignoreRectangles ? args.compareOptions.ignoreRectangles.push(ignoreRectangles) : ignoreRectangles;
        if (utils_1.isMobile(args.testInstanceData.platformName) && blockOutStatusBar
            && ((args.testInstanceData.nativeWebScreenshot && args.compareOptions.isScreen) || (utils_1.isIOS(args.testInstanceData.platformName)))) {
            const statusBarHeight = utils_1.isAndroid(args.testInstanceData.platformName) ? args.offsets.android.statusBar : args.offsets.ios.statusBar;
            const statusBarBlockOut = [utils_1.calculateDprRectangles({
                    x: 0,
                    y: 0,
                    height: statusBarHeight,
                    width: args.testInstanceData.browserWidth
                }, args.testInstanceData.devicePixelRatio)];
            args.compareOptions.ignoreRectangles = statusBarBlockOut;
        }
        if (args.debug) {
            console.log('\n####################################################');
            console.log('args.compareOptions = ', args.compareOptions);
            console.log('####################################################\n');
        }
        return new Promise(resolve => {
            resembleJS(imageComparisonPaths.baselineImage, imageComparisonPaths.actualImage, args.compareOptions)
                .onComplete(data => {
                if (Number(data.misMatchPercentage) > 0 || args.debug) {
                    data.getDiffImage().pack().pipe(fs_extra_1.createWriteStream(imageComparisonPaths.imageDiffPath));
                }
                resolve(Number(data.misMatchPercentage));
            });
        });
    });
}
exports.executeImageComparison = executeImageComparison;
//# sourceMappingURL=image.js.map