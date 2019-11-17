const { resolve } = require('path');
const { config } = require('./protractor.shared.conf');


config.seleniumAddress = 'http://localhost:4726/wd/hub';

config.multiCapabilities = [
	{
		browserName: 'safari',
		deviceName: 'iPad Pro (12.9-inch) (3rd generation)',
		logName: 'iPadPro12.9.3rdGeneration',
		platformName: 'ios',
		platformVersion: '12.1'
	},
	{
		browserName: 'safari',
		deviceName: 'iPad Pro (12.9-inch) (2nd generation)',
		logName: 'iPadPro12.9.2nd',
		platformName: 'ios',
		platformVersion: '12.1'
	},
	{
		browserName: 'safari',
		deviceName: 'iPad Pro (9.7-inch)',
		logName: 'iPadPro9.7',
		platformName: 'ios',
		platformVersion: '12.1'
	},
	{
		browserName: 'safari',
		deviceName: 'iPad Air',
		logName: 'iPad Air',
		platformName: 'ios',
		platformVersion: '12.1'
	},
	{
		browserName: 'safari',
		deviceName: 'iPhone 8',
		logName: 'iPhone8',
		platformName: 'ios',
		platformVersion: '12.1'
	},
	{
		browserName: 'safari',
		deviceName: 'iPhone X',
		logName: 'iPhoneX',
		platformName: 'ios',
		platformVersion: '12.1'
	}
];

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
