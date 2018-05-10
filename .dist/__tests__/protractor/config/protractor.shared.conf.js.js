"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const protractor_1 = require("protractor");
const path_1 = require("path");
exports.config = {
    baseUrl: 'file:///Users/wswebcreation/Git%20Projects/pic/protractor-image-comparison%20page.html',
    disableChecks: true,
    framework: 'jasmine2',
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 120000,
        isVerbose: true,
        includeStackTrace: true,
        print: function () {
        }
    },
    onPrepare: function () {
        protractor_1.browser.waitForAngularEnabled(false);
        return protractor_1.browser.getProcessedConfig()
            .then((_) => {
            protractor_1.browser.browserName = _.capabilities.browserName.toLowerCase();
            protractor_1.browser.logName = _.capabilities.logName;
            protractor_1.browser.imageComparison = require(path_1.join(process.cwd(), '.dist', 'lib', 'interfaces', 'Interfaces')).protractor({
                baselineFolder: 'here/there/',
                debug: true,
                formatImageName: `{tag}-{somethin}-{width}x{height}`,
                screenshotPath: 'here/nowhere/'
            });
            if (!('platformName' in _.capabilities)) {
                return protractor_1.browser.driver.manage().window().setSize(1366, 768);
            }
        });
    }
};
//# sourceMappingURL=protractor.shared.conf.js.js.map