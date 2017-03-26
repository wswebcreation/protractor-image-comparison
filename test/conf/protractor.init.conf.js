let config = require('./protractor.local.conf.js').config;

config.specs= ['../init.spec.js'];

exports.config = config;
