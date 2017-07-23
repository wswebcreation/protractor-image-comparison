'use strict';

let config = require('./protractor.shared.conf.js').config;
const SAUCE_USERNAME = process.env.SAUCE_USERNAME ? process.env.SAUCE_USERNAME : process.env.IC_SAUCE_USERNAME;
const SAUCE_ACCESS_KEY = process.env.SAUCE_ACCESS_KEY ? process.env.SAUCE_ACCESS_KEY : process.env.IC_SAUCE_ACCESS_KEY;
const deskSpecs = ['../desktop.spec.js'];
const mobileSpecs = ['../mobile.spec.js'];


config.sauceUser = SAUCE_USERNAME;
config.sauceKey = SAUCE_ACCESS_KEY;

config.multiCapabilities = [

    // // Mobile
    // {
    //     // SauceLabs
    //     appiumVersion: "1.6.3",
    //     browserName: 'Safari',
    //     deviceName: "iPhone 6 Simulator",
    //     deviceOrientation: "portrait",
    //     platformName: 'iOS',
    //     platformVersion: '10.0',
    //     build: process.env.TRAVIS_JOB_NUMBER,
    //     public: "public",
    //     "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER,
    //     logName: "iPhone 6 Simulator Safari",
    //     shardTestFiles: true,
    //     specs: mobileSpecs
    // },
    // {
    //     // SauceLabs
    //     appiumVersion: "1.6.3",
    //     browserName: 'Safari',
    //     deviceName: "iPad Air 2 Simulator",
    //     deviceOrientation: "portrait",
    //     platformName: 'iOS',
    //     platformVersion: '10.0',
    //     build: process.env.TRAVIS_JOB_NUMBER,
    //     public: "public",
    //     "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER,
    //     logName: "iPad Air 2 Simulator Safari",
    //     shardTestFiles: true,
    //     specs: mobileSpecs
    // },
    // Desktop
    {
        // SauceLabs
        browserName: 'chrome',
        platform: "Windows 10",
        version: "latest",
        screenResolution: "1400x1050",
        build: process.env.TRAVIS_JOB_NUMBER,
        // passed: true,
        public: "public",
        "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER,
        logName: "Chrome latest",
        shardTestFiles: true,
        specs: deskSpecs
    },
    // {
    //     // SauceLabs
    //     browserName: 'firefox',
    //     platform: "Windows 10",
    //     version: "latest",
    //     screenResolution: "1400x1050",
    //     build: process.env.TRAVIS_JOB_NUMBER,
    //     public: "public",
    //     "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER,
    //     logName: "Firefox latest",
    //     shardTestFiles: true,
    //     specs: deskSpecs
    // },
    // {
    //     // SauceLabs
    //     browserName: 'firefox',
    //     platform: "Windows 10",
    //     version: "47",
    //     screenResolution: "1400x1050",
    //     build: process.env.TRAVIS_JOB_NUMBER,
    //     public: "public",
    //     "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER,
    //     logName: "Firefox 47",
    //     shardTestFiles: true,
    //     specs: deskSpecs
    // },
    // {
    //     // SauceLabs
    //     browserName: 'internet explorer',
    //     platform: "Windows 8.1",
    //     version: "11.0",
    //     screenResolution: "1400x1050",
    //     build: process.env.TRAVIS_JOB_NUMBER,
    //     public: "public",
    //     "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER,
    //     logName: "IE11",
    //     shardTestFiles: true,
    //     specs: deskSpecs
    // },
    // {
    //     // SauceLabs
    //     browserName: 'MicrosoftEdge',
    //     platform: "Windows 10",
    //     version: "latest",
    //     screenResolution: "1400x1050",
    //     build: process.env.TRAVIS_JOB_NUMBER,
    //     public: "public",
    //     "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER,
    //     logName: "Microsoft Edge latest",
    //     shardTestFiles: true,
    //     specs: deskSpecs
    // },
    // // Use 9 and 10 because of the different webdriver, 9 has an old and 10 a new
    // {
    //     // SauceLabs
    //     browserName: 'safari',
    //     platform: "OS X 10.11",
    //     version: "9",
    //     screenResolution: "1600x1200",
    //     build: process.env.TRAVIS_JOB_NUMBER,
    //     public: "public",
    //     "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER,
    //     logName: "Safari 9",
    //     shardTestFiles: true,
    //     specs: deskSpecs
    // },
    // {
    //     // SauceLabs
    //     browserName: 'safari',
    //     platform: "OS X 10.11",
    //     version: "10",
    //     screenResolution: "1600x1200",
    //     build: process.env.TRAVIS_JOB_NUMBER,
    //     public: "public",
    //     "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER,
    //     logName: "Safari 10",
    //     shardTestFiles: true,
    //     specs: deskSpecs
    // }
];

exports.config = config;
