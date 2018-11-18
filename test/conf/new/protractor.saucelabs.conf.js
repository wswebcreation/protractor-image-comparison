'use strict';

let config = require('../protractor.shared.conf.js').config;
const basicSpecs = '../../basics.spec.js';
const deskSpecs = '../../new.desktop.spec.js';
const mobileSpecs = '../../new.mobile.spec.js';

config.sauceUser = process.env.IC_SAUCE_USERNAME ? process.env.IC_SAUCE_USERNAME : process.env.SAUCE_USERNAME;
config.sauceKey = process.env.IC_SAUCE_ACCESS_KEY ? process.env.IC_SAUCE_ACCESS_KEY : process.env.SAUCE_ACCESS_KEY;
config.sauceBuild = process.env.TRAVIS_JOB_NUMBER;

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
		tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
		shardTestFiles: true,
		specs: [ mobileSpecs ]
	},
	{
		deviceName: 'iPad Pro (9.7 inch) Simulator',
		browserName: 'safari',
		logName: 'iPadPro9.7Simulator',
		platformName: 'ios',
		platformVersion: '11.3',
		tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
		shardTestFiles: true,
		specs: [ mobileSpecs ]
	},
	{
		deviceName: 'iPad Air Simulator',
		browserName: 'safari',
		logName: 'iPadAirSimulator',
		platformName: 'ios',
		platformVersion: '10.3',
		tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
		shardTestFiles: true,
		specs: [ mobileSpecs ]
	},
	{
		browserName: 'safari',
		deviceName: 'iPhone 8 Simulator',
		logName: 'iPhone8Simulator',
		platformName: 'ios',
		platformVersion: '12.0',
		tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
		shardTestFiles: true,
		specs: [ mobileSpecs ]
	},
	{
		browserName: 'safari',
		deviceName: 'iPhone X Simulator',
		logName: 'iPhoneXSimulator',
		platformName: 'ios',
		platformVersion: '12.0',
		tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
		shardTestFiles: true,
		specs: [ mobileSpecs ]
	},
	// Not supported in the cloud now
	// {
	// 	deviceName: 'iPad Pro (12.9-inch) (3rd generation)',
	// 	browserName: 'safari',
	// 	logName: 'iPadPro12.9.3rdGeneration',
	// 	platformName: 'ios',
	// 	platformVersion: '12.1'
	// },

	/**
	 * Android with native Webscreenshot
	 */
	{
		browserName: 'chrome',
		deviceName: 'Google Pixel GoogleAPI Emulator',
		logName: 'GooglePixelGoogleAPIEmulator7.1NativeWebScreenshot',
		platformName: 'Android',
		platformVersion: '7.1',
		tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
		shardTestFiles: true,
		specs: [ mobileSpecs ],
		nativeWebScreenshot: true,
	},
	{
		browserName: 'chrome',
		deviceName: 'Android GoogleAPI Emulator',
		logName: 'AndroidGoogleApiEmulator6.0NativeWebScreenshot',
		platformName: 'Android',
		platformVersion: '6.0',
		tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
		shardTestFiles: true,
		specs: [ mobileSpecs ],
		nativeWebScreenshot: true,
	},
	// Not supporting Android Tablets now with nativeWebScreenshot
	// {
	// 	browserName: 'chrome',
	// 	deviceName: 'Google Pixel C GoogleAPI Emulator',
	// 	logName: 'GooglePixelCTablet7.1NativeWebScreenshot',
	// 	platformName: 'Android',
	// 	platformVersion: '7.1',
	// 	tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
	// 	shardTestFiles: true,
	// 	specs: [ mobileSpecs ],
	// 	nativeWebScreenshot: true,
	// },

	/**
	 * Android with chrome driver screenshots
	 */
	{
		browserName: 'chrome',
		deviceName: 'Google Pixel GoogleAPI Emulator',
		logName: 'GooglePixelGoogleAPIEmulator7.1ChromeDriver',
		platformName: 'Android',
		platformVersion: '7.1',
		tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
		shardTestFiles: true,
		specs: [ mobileSpecs ],
	},
	{
		browserName: 'chrome',
		deviceName: 'Android GoogleAPI Emulator',
		logName: 'AndroidGoogleApiEmulator6.0ChromeDriver',
		platformName: 'Android',
		platformVersion: '6.0',
		tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
		shardTestFiles: true,
		specs: [ mobileSpecs ],
	},
	{
		browserName: 'chrome',
		deviceName: 'Google Pixel C GoogleAPI Emulator',
		logName: 'GooglePixelCTablet7.1ChromeDriver',
		platformName: 'Android',
		platformVersion: '7.1',
		tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
		shardTestFiles: true,
		specs: [ mobileSpecs ],
	},

	/**
	 * Desktop browsers
	 */
	{
		browserName: 'chrome',
		platform: 'Windows 10',
		version: 'latest',
		screenResolution: '1400x1050',
		public: 'public',
		tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
		logName: 'chrome-latest',
		shardTestFiles: true,
		specs: [ basicSpecs, deskSpecs ],
	},
	{
		browserName: 'firefox',
		platform: 'Windows 10',
		version: 'latest',
		screenResolution: '1400x1050',
		public: 'public',
		'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
		logName: 'Firefox latest',
		shardTestFiles: true,
		specs: [ deskSpecs ]
	},

	// {
	//     browserName: 'firefox',
	//     platform: "Windows 10",
	//     version: "47",
	//     screenResolution: "1400x1050",
	//     public: "public",
	//     "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER,
	//     logName: "Firefox 47",
	//     shardTestFiles: true,
	//     specs: [deskSpecs]
	// },
	// {
	//     browserName: 'internet explorer',
	//     platform: "Windows 8.1",
	//     version: "11.0",
	//     screenResolution: "1400x1050",
	//     public: "public",
	//     "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER,
	//     logName: "IE11",
	//     shardTestFiles: true,
	//     specs: [deskSpecs]
	// },
	// {
	//     browserName: 'MicrosoftEdge',
	//     platform: "Windows 10",
	//     version: "latest",
	//     screenResolution: "1400x1050",
	//     public: "public",
	//     "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER,
	//     logName: "Microsoft Edge latest",
	//     shardTestFiles: true,
	//     specs: [deskSpecs]
	// },
	// // Use 9 and 10 because of the different webdriver, 9 has an old and 10 a new
	// {
	//     browserName: 'safari',
	//     platform: "OS X 10.11",
	//     version: "9",
	//     screenResolution: "1600x1200",
	//     public: "public",
	//     "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER,
	//     logName: "Safari 9",
	//     shardTestFiles: true,
	//     specs: [deskSpecs]
	// },
	// {
	//     browserName: 'safari',
	//     platform: "OS X 10.11",
	//     version: "10",
	//     screenResolution: "1600x1200",
	//     public: "public",
	//     "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER,
	//     logName: "Safari 10",
	//     shardTestFiles: true,
	//     specs: [deskSpecs]
	// }
];

config.plugins = [ {
	path: '../../../build/index.js',
	options: {
		baselineFolder: './localBaseline',
		debug: false,
		formatImageName: `{tag}-{logName}-{width}x{height}`,
		screenshotPath: '.tmp/',
		savePerInstance: true,
	}
} ];

exports.config = config;
