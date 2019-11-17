const { resolve } = require('path');
const { config } = require('./protractor.shared.conf');

const SCREEN_RESOLUTON = '1600x1200';

const {
	IC_SAUCE_USERNAME,
	SAUCE_USERNAME,
	IC_SAUCE_ACCESS_KEY,
	SAUCE_ACCESS_KEY,
	TRAVIS_JOB_NUMBER = 'local-build'
} = process.env;

const DEFAULT_CAPABILITIES = {
	shardTestFiles: true,
	tunnelIdentifier: TRAVIS_JOB_NUMBER,
};

config.sauceUser = IC_SAUCE_USERNAME || SAUCE_USERNAME;
config.sauceKey = IC_SAUCE_ACCESS_KEY || SAUCE_ACCESS_KEY;
config.sauceBuild = TRAVIS_JOB_NUMBER;

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
		...DEFAULT_CAPABILITIES,
	},
	{
		deviceName: 'iPad Air Simulator',
		browserName: 'safari',
		logName: 'iPadAirSimulator',
		platformName: 'ios',
		platformVersion: '12.2',
		...DEFAULT_CAPABILITIES,
	},
	{
		browserName: 'safari',
		deviceName: 'iPhone 8 Simulator',
		logName: 'iPhone8Simulator',
		platformName: 'ios',
		platformVersion: '11.3',
		...DEFAULT_CAPABILITIES,
	},
	{
		browserName: 'safari',
		deviceName: 'iPhone X Simulator',
		logName: 'iPhoneXSimulator',
		platformName: 'ios',
		platformVersion: '12.2',
		...DEFAULT_CAPABILITIES,
	},
	{
		browserName: 'safari',
		deviceName: 'iPhone 11 Simulator',
		logName: 'iPhone11Simulator',
		platformName: 'ios',
		platformVersion: '13.0',
		...DEFAULT_CAPABILITIES,
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
	// 	...DEFAULT_CAPABILITIES,
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
		nativeWebScreenshot: true,
		...DEFAULT_CAPABILITIES,
	},
	{
		browserName: 'chrome',
		deviceName: 'Google Pixel GoogleAPI Emulator',
		logName: 'GooglePixelGoogleAPIEmulator8.1NativeWebScreenshot',
		platformName: 'Android',
		platformVersion: '8.1',
		nativeWebScreenshot: true,
		...DEFAULT_CAPABILITIES,
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
	// 	nativeWebScreenshot: true,
	// 	...DEFAULT_CAPABILITIES,
	// },
	{
		browserName: 'chrome',
		deviceName: 'Android GoogleAPI Emulator',
		logName: 'AndroidGoogleApiEmulator6.0NativeWebScreenshot',
		platformName: 'Android',
		platformVersion: '6.0',
		nativeWebScreenshot: true,
		...DEFAULT_CAPABILITIES,
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
		...DEFAULT_CAPABILITIES,
	},
	{
		browserName: 'chrome',
		deviceName: 'Google Pixel GoogleAPI Emulator',
		logName: 'GooglePixelGoogleAPIEmulator8.1ChromeDriver',
		platformName: 'Android',
		platformVersion: '8.1',
		...DEFAULT_CAPABILITIES,
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
	// 	...DEFAULT_CAPABILITIES,
	// },
	{
		browserName: 'chrome',
		deviceName: 'Android GoogleAPI Emulator',
		logName: 'AndroidGoogleApiEmulator6.0ChromeDriver',
		platformName: 'Android',
		platformVersion: '6.0',
		...DEFAULT_CAPABILITIES,
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
	// 	...DEFAULT_CAPABILITIES,
	// },

	/**
	 * Desktop browsers
	 */
	{
		browserName: 'chrome',
		platform: 'Windows 10',
		version: 'latest',
		logName: 'chrome-latest',
		screenResolution: SCREEN_RESOLUTON,
		...DEFAULT_CAPABILITIES,
	},
	{
		browserName: 'firefox',
		platform: 'Windows 10',
		version: 'latest',
		logName: 'Firefox latest',
		screenResolution: SCREEN_RESOLUTON,
		...DEFAULT_CAPABILITIES,
	},
	{
		browserName: 'internet explorer',
		platform: 'Windows 8.1',
		version: 'latest',
		logName: 'IE11',
		screenResolution: SCREEN_RESOLUTON,
		...DEFAULT_CAPABILITIES,
	},
	{
		browserName: 'MicrosoftEdge',
		platform: 'Windows 10',
		version: 'latest',
		logName: 'Microsoft Edge latest',
		screenResolution: SCREEN_RESOLUTON,
		...DEFAULT_CAPABILITIES,
	},
	{
		browserName: 'safari',
		platform: 'macOS 10.12',
		version: '11.0',
		logName: 'SierraSafari11',
		screenResolution: SCREEN_RESOLUTON,
		...DEFAULT_CAPABILITIES,
	},
	{
		browserName: 'safari',
		platform: 'macOS 10.14',
		version: 'latest',
		logName: 'MojaveSafariLatest',
		screenResolution: SCREEN_RESOLUTON,
		...DEFAULT_CAPABILITIES,
	}
];

config.plugins = [
	{
		path: resolve(process.cwd(), './build/index.js'),
		options: {
			baselineFolder: resolve(process.cwd(), './test/images/saucelabs'),
			screenshotPath: resolve(process.cwd(), '.tmp/'),
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
