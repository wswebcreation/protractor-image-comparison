'use strict';
const chalk = require('chalk');
const child_process = require('child_process');
const fs = require('fs-extra');
const localConfig = require('../../local.config.json');
const path = require('path');
function runTest(command) {
    const isObject = typeof command === 'object';
    const allowedEnv = ['local', 'saucelabs', 'android.adb', 'android.chromedriver', 'ios.simulator', 'perfecto', 'init'];
    const protractorRoot = path.dirname(require.resolve('protractor/package.json'));
    const protractorExec = path.normalize(path.resolve(protractorRoot, 'bin/protractor'));
    let environment;
    let seleniumAddress;
    if (!isObject) {
        environment = 'local';
        seleniumAddress = '';
    }
    else {
        environment = command.env || 'local';
        seleniumAddress = command.seleniumAddress ? `--seleniumAddress=${command.seleniumAddress}` : '';
    }
    if (command.removeTmp) {
        console.log(chalk.blue(`\nRemoving the ${localConfig.screenshotFolder} folder.\n`));
        fs.removeSync(`./${localConfig.screenshotFolder}`);
    }
    if (allowedEnv.indexOf(environment) === -1)
        environment = 'local';
    const protractorConf = path.resolve(__dirname, `../conf/protractor.${environment}.conf.js`);
    const protractor = child_process.exec(`node ${protractorExec} ${protractorConf} --env=${environment} ${seleniumAddress}`);
    console.log(chalk.blue(`\nExecuting the test for environment:${environment}\n`));
    protractor.stdout.pipe(process.stdout);
    protractor.stderr.pipe(process.stderr);
    protractor.on('exit', status => process.exit(status));
}
module.exports = runTest;
//# sourceMappingURL=index.js.map