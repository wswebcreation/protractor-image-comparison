const {resolve} = require('path');
const {SpecReporter} = require('jasmine-spec-reporter');
const {removeSync} = require('fs-extra');
const {blue} = require('chalk');

exports.config = {
	baseUrl: 'https://wswebcreation.github.io/protractor-image-comparison/',
	disableChecks: true,
	framework: 'jasmine2',
	maxInstances: 5,
	jasmineNodeOpts: {
		showColors: true,
		defaultTimeoutInterval: 180000,
		isVerbose: true,
		includeStackTrace: true,
		print: () => {
		}
	},
	SELENIUM_PROMISE_MANAGER: false,
	beforeLaunch: () => {
		const screenshotPath = './test/images/';
		const actual = resolve(process.cwd(), screenshotPath, 'actual');
		const diff = resolve(process.cwd(), screenshotPath, 'diff');

		console.log(blue('\n###################################################################'));
		console.log(blue(`Removing the ${actual} folder.`));
		console.log(blue(`Removing the ${diff} folder.`));
		console.log(blue('###################################################################\n'));

		removeSync(actual);
		removeSync(diff);
	},
	onPrepare: async () => {
		// Transpile on the fly
		require('ts-node').register({
			project: resolve(__dirname, './tsconfig.e2e.json')
		});

		// Disable Angular, because it's not an angular site
		await browser.waitForAngularEnabled(false);

		// Add the reporter
		jasmine.getEnv().addReporter(new SpecReporter({
			spec: {
				displayStacktrace: 'none',
				displayFailuresSummary: false,
				displayPendingSummary: false,
				displayPendingSpec: true,
				displaySpecDuration: true
			}
		}));

		// Set some config data
		const processedConfig = await browser.getProcessedConfig();
		browser.browserName = processedConfig.capabilities.browserName.toLowerCase();
		browser.logName = processedConfig.capabilities.logName;

		// Resize the screens if it is a VM
		if (!('platformName' in processedConfig.capabilities)) {
			await browser.driver.manage().window().setSize(1366, 768);
		}
	},
	specs: [
		'../main.spec.ts'
	]
};
