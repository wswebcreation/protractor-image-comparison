const { join } = require('path');
const { removeSync } = require('fs-extra');
const { blue } = require('chalk');
let config = require('./protractor.shared.conf').config;

config.specs = [
	'../basics.spec.ts',
	'../desktop.spec.ts',
];

config.beforeLaunch = () => {
	const tmp = join(process.cwd(), '.tmp/');
	console.log(blue('\n###################################################################'));
	console.log(blue(`Removing the ${ tmp } folder.`));
	console.log(blue('###################################################################\n'));
	removeSync(tmp);
};

config.seleniumAddress = 'http://localhost:4444/wd/hub/';

config.multiCapabilities = [
	{
		browserName: 'chrome',
		logName: 'chrome-latest',
		shardTestFiles: true,
		chromeOptions: {
			args: [ 'disable-infobars' ]
		},
	},
	{
		browserName: 'chrome',
		logName: 'chrome-headless-latest',
		shardTestFiles: true,
		chromeOptions: {
			args: [ '--headless' ]
		},
	},
];

config.plugins = [
	{
		path: join(process.cwd(), './build/index.js'),
		options: {
			baselineFolder: join(process.cwd(), './localBaseline/'),
			debug: false,
			formatImageName: `{tag}-{logName}-{width}x{height}`,
			screenshotPath: join(process.cwd(), '.tmp/'),
			savePerInstance: true,
			autoSaveBaseline: true,
		},
	},
];

exports.config = config;
