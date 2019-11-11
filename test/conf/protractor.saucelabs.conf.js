const {join} = require('path');
let {config} = require('./protractor.shared.conf');
const basicSpecs = '../basics.spec.ts';
const saveMethodFolderSpecs = '../saveMethodsFolders.spec.ts';
const checkMethodFolderSpecs = '../checkMethodsFolders.spec.ts';
const deskSpecs = '../desktop.spec.ts';
const mobileSpecs = '../mobile.spec.ts';
const screenResolution = '1600x1200';
const defaultCapabilities = {
	shardTestFiles: true,
	tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
};

config.sauceUser = process.env.IC_SAUCE_USERNAME ? process.env.IC_SAUCE_USERNAME : process.env.SAUCE_USERNAME;
config.sauceKey = process.env.IC_SAUCE_ACCESS_KEY ? process.env.IC_SAUCE_ACCESS_KEY : process.env.SAUCE_ACCESS_KEY;
config.sauceBuild = process.env.TRAVIS_JOB_NUMBER || 'local-build';

config.multiCapabilities = [
	/**
	 * iOS
	 */
	{
		deviceName: 'iPad Pro (12.9 inch) (2nd generation) Simulator',
		browserName: 'safari',
		logName: 'iPadPro12.9.2nd',
		platformName: 'ios',
		platformVersion: '12.0',
		specs: [mobileSpecs],
		...defaultCapabilities,
	},
	{
		deviceName: 'iPad Air Simulator',
		browserName: 'safari',
		logName: 'iPadAirSimulator',
		platformName: 'ios',
		platformVersion: '12.2',
		specs: [mobileSpecs],
		...defaultCapabilities,
	},
	{
		browserName: 'safari',
		deviceName: 'iPhone 8 Simulator',
		logName: 'iPhone8Simulator',
		platformName: 'ios',
		platformVersion: '11.3',
		specs: [mobileSpecs],
		...defaultCapabilities,
	},
	{
		browserName: 'safari',
		deviceName: 'iPhone X Simulator',
		logName: 'iPhoneXSimulator',
		platformName: 'ios',
		platformVersion: '12.2',
		specs: [mobileSpecs],
		...defaultCapabilities,
	},
	{
		browserName: 'safari',
		deviceName: 'iPhone 11 Simulator',
		logName: 'iPhone11Simulator',
		platformName: 'ios',
		platformVersion: '13.0',
		specs: [mobileSpecs],
		...defaultCapabilities,
	},
	// {
	// 	deviceName: 'iPad Pro (12.9 inch) (3rd generation) Simulator',
	// 	browserName: 'safari',
	// 	logName: 'iPadPro12.9.3rdGeneration',
	// 	platformName: 'ios',
	// 	platformVersion: '12.2',
	// 	specs: [ mobileSpecs ],
	// 	...defaultCapabilities,
	// },

	/**
	 * Android with native Webscreenshot
	 */
	{
		browserName: 'chrome',
		deviceName: 'Samsung Galaxy S9 WQHD GoogleAPI Emulator',
		logName: 'EmulatorSamsungGalaxyS9WQHDGoogleAPI9.0NativeWebScreenshot',
		platformName: 'Android',
		platformVersion: '9.0',
		specs: [ mobileSpecs ],
		nativeWebScreenshot: true,
		...defaultCapabilities,
	},
	{
		browserName: 'chrome',
		deviceName: 'Google Pixel GoogleAPI Emulator',
		logName: 'GooglePixelGoogleAPIEmulator8.1NativeWebScreenshot',
		platformName: 'Android',
		platformVersion: '8.1',
		specs: [mobileSpecs],
		nativeWebScreenshot: true,
		...defaultCapabilities,
	},
	/**
	 * 7.1 is disabled due to image problems
	 */
	// {
	// 	browserName: 'chrome',
	// 	deviceName: 'Google Pixel GoogleAPI Emulator',
	// 	logName: 'GooglePixelGoogleAPIEmulator7.1NativeWebScreenshot',
	// 	platformName: 'Android',
	// 	platformVersion: '7.1',
	// 	specs: [mobileSpecs],
	// 	nativeWebScreenshot: true,
	// 	...defaultCapabilities,
	// },
	{
		browserName: 'chrome',
		deviceName: 'Android GoogleAPI Emulator',
		logName: 'AndroidGoogleApiEmulator6.0NativeWebScreenshot',
		platformName: 'Android',
		platformVersion: '6.0',
		specs: [mobileSpecs],
		nativeWebScreenshot: true,
		...defaultCapabilities,
	},
	// Not supporting Android Tablets now with nativeWebScreenshot
	// {
	// 	browserName: 'chrome',
	// 	deviceName: 'Google Pixel C GoogleAPI Emulator',
	// 	logName: 'GooglePixelCTablet7.1NativeWebScreenshot',
	// 	platformName: 'Android',
	// 	platformVersion: '7.1',
	// 	tunnelIdentifier,
	// 	shardTestFiles,
	// 	specs: [ mobileSpecs ],
	// 	nativeWebScreenshot: true,
	// },

	/**
	 * Android with chrome driver screenshots
	 */
	{
		browserName: 'chrome',
		deviceName: 'Samsung Galaxy S9 WQHD GoogleAPI Emulator',
		logName: 'EmulatorSamsungGalaxyS9WQHDGoogleAPI9.0ChromeDriver',
		platformName: 'Android',
		platformVersion: '9.0',
		specs: [ mobileSpecs ],
		...defaultCapabilities,
	},
	{
		browserName: 'chrome',
		deviceName: 'Google Pixel GoogleAPI Emulator',
		logName: 'GooglePixelGoogleAPIEmulator8.1ChromeDriver',
		platformName: 'Android',
		platformVersion: '8.1',
		specs: [mobileSpecs],
		...defaultCapabilities,
	},
	/**
	 * 7.1 is disabled due to image problems
	 */
	// {
	// 	browserName: 'chrome',
	// 	deviceName: 'Google Pixel GoogleAPI Emulator',
	// 	logName: 'GooglePixelGoogleAPIEmulator7.1ChromeDriver',
	// 	platformName: 'Android',
	// 	platformVersion: '7.1',
	// 	specs: [mobileSpecs],
	// 	...defaultCapabilities,
	// },
	{
		browserName: 'chrome',
		deviceName: 'Android GoogleAPI Emulator',
		logName: 'AndroidGoogleApiEmulator6.0ChromeDriver',
		platformName: 'Android',
		platformVersion: '6.0',
		specs: [mobileSpecs],
		...defaultCapabilities,
	},
	/**
	 * 7.1 is disabled due to image problems
	 */
	// {
	// 	browserName: 'chrome',
	// 	deviceName: 'Google Pixel C GoogleAPI Emulator',
	// 	logName: 'GooglePixelCTablet7.1ChromeDriver',
	// 	platformName: 'Android',
	// 	platformVersion: '7.1',
	// 	specs: [mobileSpecs],
	// 	...defaultCapabilities,
	// },

	/**
	 * Desktop browsers
	 */
	{
		browserName: 'chrome',
		platform: 'Windows 10',
		version: 'latest',
		logName: 'chrome-latest',
		specs: [basicSpecs],
		screenResolution,
		...defaultCapabilities,
	},
	{
		browserName: 'chrome',
		platform: 'Windows 10',
		version: 'latest',
		logName: 'chrome-latest',
		specs: [saveMethodFolderSpecs],
		screenResolution,
		...defaultCapabilities,
	},
	{
		browserName: 'chrome',
		platform: 'Windows 10',
		version: 'latest',
		logName: 'chrome-latest',
		specs: [checkMethodFolderSpecs],
		screenResolution,
		...defaultCapabilities,
	},
	{
		browserName: 'chrome',
		platform: 'Windows 10',
		version: 'latest',
		logName: 'chrome-latest',
		specs: [deskSpecs],
		screenResolution,
		...defaultCapabilities,
	},
	{
		browserName: 'firefox',
		platform: 'Windows 10',
		version: 'latest',
		logName: 'Firefox latest',
		specs: [deskSpecs],
		screenResolution,
		...defaultCapabilities,
	},
	{
		browserName: 'internet explorer',
		platform: 'Windows 8.1',
		version: 'latest',
		logName: 'IE11',
		specs: [deskSpecs],
		screenResolution,
		...defaultCapabilities,
	},
	{
		browserName: 'MicrosoftEdge',
		platform: 'Windows 10',
		version: 'latest',
		logName: 'Microsoft Edge latest',
		specs: [deskSpecs],
		screenResolution,
		...defaultCapabilities,
	},
	{
		browserName: 'safari',
		platform: 'macOS 10.12',
		version: '11.0',
		logName: 'SierraSafari11',
		specs: [deskSpecs],
		screenResolution,
		...defaultCapabilities,
	},
	{
		browserName: 'safari',
		platform: 'macOS 10.14',
		version: 'latest',
		logName: 'MojaveSafariLatest',
		specs: [deskSpecs],
		screenResolution,
		...defaultCapabilities,
	}
];

config.plugins = [
	{
		path: join(process.cwd(), './build/index.js'),
		options: {
			baselineFolder: join(process.cwd(), './test/sauceLabsBaseline/'),
			debug: true,
			formatImageName: `{tag}-{logName}-{width}x{height}`,
			screenshotPath: join(process.cwd(), '.tmp/'),
			savePerInstance: true,
			autoSaveBaseline: true,
			blockOutStatusBar: true,
			blockOutToolBar: true,
		},
	},
];

exports.config = config;
