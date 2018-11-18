let config = require('../protractor.shared.conf.js').config;

config.specs = [
	'../../basics.spec.js',
	'../../new.desktop.spec.js',
];

config.seleniumAddress = 'http://localhost:4444/wd/hub/';

config.capabilities = {
  browserName: 'chrome',
  logName: "chrome-latest",
  shardTestFiles: true,
  chromeOptions: {
    args: ['disable-infobars']
  },
};

config.plugins = [{
  path: '../../../build/index.js',
	options:{
		baselineFolder: './localBaseline',
		debug: false,
		formatImageName: `{tag}-{logName}-{width}x{height}`,
		screenshotPath: '.tmp/',
		savePerInstance: true,
	}
}];

exports.config = config;
