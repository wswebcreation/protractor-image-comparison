let config = require('./protractor.shared.conf.js').config;

config.specs = ['../new.spec.js'];

config.seleniumAddress = 'http://localhost:4444/wd/hub/';

config.capabilities = {
  browserName: 'chrome',
  logName: "Chrome",
  shardTestFiles: true,
  chromeOptions: {
    args: ['disable-infobars']
  },
};

config.plugins = [{
  // package: 'protractor-image-comparison',
  path: '../../build/index.js',
}];

exports.config = config;
