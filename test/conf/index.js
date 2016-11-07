const chalk = require('chalk'),
    child_process = require('child_process'),
    path = require('path');

function runTest(command) {
    const isObject = typeof command === 'object',
        allowedEnv = ['local', 'saucelabs', 'android.adb', 'android.chromedriver', 'ios.simulator', 'perfecto'],
        protractorRoot = path.dirname(require.resolve('protractor/package.json')),
        protractorExec = path.normalize(path.resolve(protractorRoot, 'bin/protractor'));

    let environment = !isObject ? 'local' : command.env ? command.env : 'local',
        seleniumAddress = !isObject ? '': command.seleniumAddress ? `--seleniumAddress=${command.seleniumAddress}` : '';

    if (allowedEnv.indexOf(environment) === -1) environment = 'local';

    const protractorConf = path.resolve(__dirname, `../conf/protractor.${environment}.conf.js`),
        protractor = child_process.exec(`node ${protractorExec} ${protractorConf} ${seleniumAddress}`);

    console.log(chalk.blue(`Executing the test for environment:${environment}`));

    protractor.stdout.pipe(process.stdout);
    protractor.stderr.pipe(process.stderr);
    protractor.on('exit', status => process.exit(status));
}

module.exports = runTest;
