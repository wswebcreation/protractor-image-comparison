"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const protractor_shared_conf_1 = require("./protractor.shared.conf");
protractor_shared_conf_1.config.specs = ['../desktop.spec.js'];
protractor_shared_conf_1.config.seleniumAddress = 'http://localhost:4444/wd/hub/';
protractor_shared_conf_1.config.capabilities = {
    browserName: 'chrome',
    logName: "Chrome",
    shardTestFiles: true,
    chromeOptions: {
        args: ['disable-infobars']
    },
};
exports.config = protractor_shared_conf_1.config;
//# sourceMappingURL=protractor.local.conf.js.map