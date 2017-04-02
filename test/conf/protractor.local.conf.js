let config = require('./protractor.shared.conf.js').config;

config.specs = ['../desktop.spec.js'];

config.seleniumAddress = 'http://localhost:4444/wd/hub/';

config.capabilities = {
    browserName: 'chrome',
    logName: "Chrome",
    shardTestFiles: true,
    chromeOptions: {
        args: ['disable-infobars']
    },
};

exports.config = config;
