"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const camelCase = require('camel-case');
const path_1 = require("path");
const webdriverMethods_1 = require("./webdriverMethods");
function isAndroid(platformName) {
    return platformName.toLowerCase() === 'android';
}
exports.isAndroid = isAndroid;
function isIOS(platformName) {
    return platformName.toLowerCase() === 'ios';
}
exports.isIOS = isIOS;
function isMobile(platformName) {
    return platformName !== '';
}
exports.isMobile = isMobile;
function isFirefox(browserName) {
    return browserName === 'firefox';
}
exports.isFirefox = isFirefox;
function getBufferedScreenshot() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return new Buffer(yield webdriverMethods_1.takeScreenshot(), 'base64');
    });
}
exports.getBufferedScreenshot = getBufferedScreenshot;
function calculateDprRectangles(rectangles, devicePixelRatio) {
    Object.keys(rectangles).map((key) => rectangles[key] *= devicePixelRatio);
    return rectangles;
}
exports.calculateDprRectangles = calculateDprRectangles;
function formatFileName(args) {
    const defaults = {
        'browserName': args.browserName,
        'deviceName': args.deviceName,
        'dpr': args.devicePixelRatio,
        'height': args.browserHeight,
        'logName': camelCase(args.logName),
        'mobile': args.isMobile && args.testInBrowser ? args.browserName : args.isMobile ? 'app' : '',
        'name': args.name,
        'tag': args.tag,
        'width': args.browserWidth
    };
    let formatString = args.formatString;
    Object.keys(defaults)
        .forEach((value) => formatString = formatString.replace(`{${value}}`, defaults[value]));
    return formatString + '.png';
}
exports.formatFileName = formatFileName;
function determineImageComparisonPaths(args) {
    return {
        actualImage: path_1.join(args.actualFolder, args.fileName),
        baselineImage: path_1.join(args.baselineFolder, args.fileName),
        imageDiffPath: path_1.join(args.diffFolder, path_1.basename(args.fileName))
    };
}
exports.determineImageComparisonPaths = determineImageComparisonPaths;
//# sourceMappingURL=utils.js.map