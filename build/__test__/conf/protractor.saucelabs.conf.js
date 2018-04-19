'use strict';
let config = require('./protractor.shared.conf.js').config;
const deskSpecs = ['../desktop.spec.js'];
const mobileSpecs = ['../mobile.spec.js'];
config.sauceUser = process.env.SAUCE_USERNAME ? process.env.SAUCE_USERNAME : process.env.IC_SAUCE_USERNAME;
config.sauceKey = process.env.SAUCE_ACCESS_KEY ? process.env.SAUCE_ACCESS_KEY : process.env.IC_SAUCE_ACCESS_KEY;
config.sauceBuild = process.env.TRAVIS_JOB_NUMBER;
config.multiCapabilities = [
    {
        appiumVersion: "1.6.3",
        browserName: 'Safari',
        deviceName: "iPhone 6 Simulator",
        deviceOrientation: "portrait",
        platformName: 'iOS',
        platformVersion: '10.0',
        public: "public",
        "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER,
        logName: "iPhone 6 Simulator Safari",
        shardTestFiles: true,
        specs: mobileSpecs
    },
    {
        appiumVersion: "1.6.3",
        browserName: 'Safari',
        deviceName: "iPad Air 2 Simulator",
        deviceOrientation: "portrait",
        platformName: 'iOS',
        platformVersion: '10.0',
        public: "public",
        "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER,
        logName: "iPad Air 2 Simulator Safari",
        shardTestFiles: true,
        specs: mobileSpecs
    },
    {
        browserName: 'chrome',
        platform: "Windows 10",
        version: "latest",
        screenResolution: "1400x1050",
        public: "public",
        "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER,
        logName: "Chrome latest",
        shardTestFiles: true,
        specs: deskSpecs
    },
    {
        browserName: 'firefox',
        platform: "Windows 10",
        version: "latest",
        screenResolution: "1400x1050",
        public: "public",
        "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER,
        logName: "Firefox latest",
        shardTestFiles: true,
        specs: deskSpecs
    },
    {
        browserName: 'firefox',
        platform: "Windows 10",
        version: "47",
        screenResolution: "1400x1050",
        public: "public",
        "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER,
        logName: "Firefox 47",
        shardTestFiles: true,
        specs: deskSpecs
    },
    {
        browserName: 'internet explorer',
        platform: "Windows 8.1",
        version: "11.0",
        screenResolution: "1400x1050",
        public: "public",
        "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER,
        logName: "IE11",
        shardTestFiles: true,
        specs: deskSpecs
    },
    {
        browserName: 'MicrosoftEdge',
        platform: "Windows 10",
        version: "latest",
        screenResolution: "1400x1050",
        public: "public",
        "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER,
        logName: "Microsoft Edge latest",
        shardTestFiles: true,
        specs: deskSpecs
    },
    {
        browserName: 'safari',
        platform: "OS X 10.11",
        version: "9",
        screenResolution: "1600x1200",
        public: "public",
        "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER,
        logName: "Safari 9",
        shardTestFiles: true,
        specs: deskSpecs
    },
    {
        browserName: 'safari',
        platform: "OS X 10.11",
        version: "10",
        screenResolution: "1600x1200",
        public: "public",
        "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER,
        logName: "Safari 10",
        shardTestFiles: true,
        specs: deskSpecs
    }
];
exports.config = config;
//# sourceMappingURL=protractor.saucelabs.conf.js.map