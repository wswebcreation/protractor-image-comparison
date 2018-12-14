'use strict';

let SpecReporter = require('jasmine-spec-reporter').SpecReporter;

exports.config = {
	baseUrl: 'https://wswebcreation.github.io/protractor-image-comparison/',
	// baseUrl: 'http://127.0.0.1:8080',
	disableChecks: true,
	framework: 'jasmine2',
	maxInstances: 5,
	jasmineNodeOpts: {
		showColors: true,
		defaultTimeoutInterval: 180000,
		isVerbose: true,
		includeStackTrace: true,
		print: function () {
		}
	},
	onPrepare: function () {
		// Compile on the fly
		require('babel-register');

		browser.waitForAngularEnabled(false);

		jasmine.getEnv().addReporter(new SpecReporter({
			spec: {
				displayStacktrace: 'none',
				displayFailuresSummary: false,
				displayPendingSummary: false,
				displayPendingSpec: true,
				displaySpecDuration: true
			}
		}));

		return browser.getProcessedConfig().then(_ => {
			browser.browserName = _.capabilities.browserName.toLowerCase();
			browser.logName = _.capabilities.logName;

			if (!('platformName' in _.capabilities)) {
				return browser.driver.manage().window().setSize(1366, 768);
			}
		});
	}
};
