"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function initSaveScreenOptions(disableCSSAnimation, hideScrollBars, options) {
    return Object.assign({ disableCSSAnimation,
        hideScrollBars }, (options));
}
exports.initSaveScreenOptions = initSaveScreenOptions;
function initCheckScreenOptions(blockOutStatusBar, disableCSSAnimation, hideScrollBars, ignoreAntialiasing, ignoreColors, ignoreTransparentPixel, options) {
    return Object.assign({ blockOutStatusBar,
        disableCSSAnimation,
        hideScrollBars,
        ignoreAntialiasing,
        ignoreColors,
        ignoreTransparentPixel }, (options));
}
exports.initCheckScreenOptions = initCheckScreenOptions;
//# sourceMappingURL=initOptions.js.map