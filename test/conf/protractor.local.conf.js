let config = require('./protractor.shared.conf.js').config;

config.directConnect = true;

config.specs= ['../jasmine.spec.js'];

config.multiCapabilities = [
    {
        browserName: 'chrome',
        logName: "Chrome",
        maxInstances: 10,
        shardTestFiles: true,
        chromeOptions: { //check args with: chrome://version
            args: [
                '--disable-cache',
                '--disable-application-cache',
                '--disable-offline-load-stale-cache',
                '--disk-cache-size=0',
                '--v8-cache-options=off'
            ]
        }
    },
    {
        browserName: 'firefox',
        logName: 'Firefox',
        maxInstances: 10,
        shardTestFiles: true
    }
];

exports.config = config;
