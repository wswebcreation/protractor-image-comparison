const { resolve } = require('path');
const { config } = require('./protractor.shared.conf');


// config.seleniumAddress = 'http://localhost:4444/wd/hub/';

config.multiCapabilities = [
	{
		browserName: 'chrome',
		logName: 'chrome-latest',
		shardTestFiles: true,
		chromeOptions: {
			args: [ 'disable-infobars' ]
		},
	}
];

config.plugins = [
	{
		path: resolve(process.cwd(), './build/index.js'),
		options: {
			baselineFolder: resolve(process.cwd(), './test/images/local/baseline'),
			screenshotPath: resolve(process.cwd(), './test/images/local/'),
			formatImageName: '{tag}-{logName}-{width}x{height}',
			debug: false,
			savePerInstance: true,
			autoSaveBaseline: true,
			clearRuntimeFolder: true
		},
	},
];

exports.config = config;
