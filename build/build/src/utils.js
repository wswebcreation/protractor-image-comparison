"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isAndroid(platformName) {
    return platformName.toLowerCase() === 'android';
}
exports.isAndroid = isAndroid;
function isIOS(platformName) {
    return platformName.toLowerCase() === 'ios';
}
exports.isIOS = isIOS;
function isFirefox(browserName) {
    return browserName === 'firefox';
}
exports.isFirefox = isFirefox;
function isMobile(platformName) {
    return platformName !== '';
}
exports.isMobile = isMobile;
//# sourceMappingURL=utils.js.map