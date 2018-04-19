"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const protractor_1 = require("protractor");
function takeScreenshot() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return protractor_1.browser.takeScreenshot();
    });
}
exports.takeScreenshot = takeScreenshot;
function executeScript(script, ...scriptArgs) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return protractor_1.browser.driver.executeScript(script, scriptArgs);
    });
}
exports.executeScript = executeScript;
function getInstanceConfiguration() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return protractor_1.browser.getProcessedConfig();
    });
}
exports.getInstanceConfiguration = getInstanceConfiguration;
//# sourceMappingURL=webdriverMethods.js.map