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
const protractor_1 = require("protractor");
const base_client_1 = require("../base.client");
class ProtractorClient extends base_client_1.BaseImageComparisonClient {
    executeClientScript(script, ...scriptArgs) {
        return __awaiter(this, void 0, void 0, function* () {
            return protractor_1.browser.driver.executeScript(script, scriptArgs);
        });
    }
    getInstanceData() {
        return __awaiter(this, void 0, void 0, function* () {
            const instanceConfig = (yield protractor_1.browser.getProcessedConfig()).capabilities;
            const browserName = (instanceConfig.browserName || '').toLowerCase();
            const logName = instanceConfig.logName || '';
            const name = instanceConfig.name || '';
            const platformName = (instanceConfig.platformName || '').toLowerCase();
            const deviceName = (instanceConfig.deviceName || '').toLowerCase();
            const nativeWebScreenshot = !!instanceConfig.nativeWebScreenshot;
            return {
                browserName,
                deviceName,
                logName,
                name,
                nativeWebScreenshot,
                platformName,
            };
        });
    }
    takeScreenshot() {
        return __awaiter(this, void 0, void 0, function* () {
            return protractor_1.browser.takeScreenshot();
        });
    }
}
exports.default = ProtractorClient;
//# sourceMappingURL=protractor.js.map