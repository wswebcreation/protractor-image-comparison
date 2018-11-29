const { join } = require('path');
let config = require('../protractor.shared.conf.js').config;

config.specs = [
	'../../basics.spec.js',
	'../../new.desktop.spec.js',
];

config.seleniumAddress = 'http://localhost:4444/wd/hub/';

config.capabilities = {
	browserName: 'chrome',
	logName: 'chrome-latest',
	shardTestFiles: true,
	chromeOptions: {
		args: [ 'disable-infobars' ]
	},
};

config.plugins = [ {
	path: join(process.cwd(), './build/index.js'),
	options: {
		baselineFolder: join(process.cwd(), './test/sauceBaseline/'),
		debug: false,
		formatImageName: `{tag}-{logName}-{width}x{height}`,
		screenshotPath: join(process.cwd(), '.tmp/'),
		savePerInstance: true,
		autoSaveBaseline: true,
	}
} ];

exports.config = config;
