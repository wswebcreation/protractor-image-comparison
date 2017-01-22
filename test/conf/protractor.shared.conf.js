'use strict';

const SpecReporter = require('jasmine-spec-reporter');

exports.config = {
    // baseUrl: 'https://wswebcreation.github.io/protractor-image-comparison/',
    baseUrl: 'http://www.verloskundigenpraktijkmorgenland.nl/',
    // baseUrl: 'http://www.detesters.nl/',
    framework: 'jasmine2',
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 120000,
        isVerbose: true,
        includeStackTrace: true
    },
    onPrepare: function () {
        browser.ignoreSynchronization = true;

        const env = jasmine.getEnv();

        env.clearReporters();

        env.addReporter(new SpecReporter({
            displayStacktrace: 'none',
            displayFailuresSummary: false,
            displayPendingSummary: false,
            displayPendingSpec: true,
            displaySpecDuration: true
        }));

        return browser.getProcessedConfig()
            .then(_ => {
                browser.browserName = _.capabilities.browserName.toLowerCase();
                browser.logName = _.capabilities.logName;

                if (!('platformName' in _.capabilities)) {
                    return browser.driver.manage().window().setSize(1366, 768);
                } else if ('platformName' in _.capabilities) {
                    const wd = require('wd');
                    const protractor = require('protractor');
                    const wdBridge = require('wd-bridge')(protractor, wd);

                    wdBridge.initFromProtractor(exports.config);
                }
            });
    }
};
