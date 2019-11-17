const { resolve } = require('path');
const { config } = require('./protractor.shared.conf');


config.seleniumAddress = 'http://localhost:4726/wd/hub';

config.capabilities = {
	browserName: 'Chrome',
	deviceName: 'Pixel2_9.0',
	logName: 'Pixel2_9.0',
	platformName: 'android',
	automationName: 'UiAutomator2',
	// Looks like an issue with Chromedriver
	// see https://github.com/appium/appium/issues/11083
	// That's why it is on
	nativeWebScreenshot: true,
	norReset: true,
	chromeOpts: {
		args: [ '--no-first-run' ],
	},
};

config.plugins = [
	{
		path: resolve(process.cwd(), './build/index.js'),
		options: {
			baselineFolder: resolve(process.cwd(), './test/images/baseline'),
			screenshotPath: resolve(process.cwd(), './test/images/'),
			formatImageName: '{tag}-{logName}-{width}x{height}',
			debug: false,
			savePerInstance: true,
			autoSaveBaseline: true,
			blockOutStatusBar: true,
			blockOutToolBar: true,
			clearRuntimeFolder: true
		},
	},
];

exports.config = config;
