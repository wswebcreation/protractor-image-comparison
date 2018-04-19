'use strict';
const program = require('commander');
const run = require('./conf/');
program
    .command('image-comparison')
    .option('-e, --env [env]', 'Run e2e tests [local, saucelabs, android.adb, android.chromedriver, ios.simulator, perfecto, init]')
    .option('-s, --seleniumAddress [seleniumAddress]', 'The seleniumAddress')
    .option('-r, --removeTmp', 'Remove the .tmp/ folder')
    .description('Run tests on a given device')
    .action(run);
program
    .parse(process.argv);
//# sourceMappingURL=cli.js.map