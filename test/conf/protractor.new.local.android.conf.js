let config = require('./protractor.shared.conf.js').config;

config.specs = ['../new.mobile.spec.js'];

config.seleniumAddress = 'http://localhost:4726/wd/hub';

config.capabilities = {
	browserName: 'chrome',
	deviceName: 'Pixel2_9.0',
	logName: 'Pixel2_9.0',
	platformName: 'android',
	automationName: 'UiAutomator2',
	// Looks like an issue with Chromedriver
	// see https://github.com/appium/appium/issues/11083
	// That's why it is on
	nativeWebScreenshot: true
};

config.plugins = [{
  // package: 'protractor-image-comparison',
  path: '../../build/index.js',
}];

exports.config = config;
