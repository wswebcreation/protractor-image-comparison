const SpecReporter = require('jasmine-spec-reporter');

exports.config = {
    baseUrl: 'http://example.wswebcreation.nl',
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
        browser.ignoreSynchronization = true;

        var env = jasmine.getEnv();

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
                    var wd = require('wd'),
                        protractor = require('protractor'),
                        wdBridge = require('wd-bridge')(protractor, wd);
                    wdBridge.initFromProtractor(exports.config);
                }
            });
    }
};
