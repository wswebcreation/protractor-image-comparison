'use strict';

const camelCase = require('camel-case');
const fs = require('fs-extra');
const imageComparison = require('../');
const localConfig = require('../local.config.json');
const path = require('path');
const screenshotPath = path.resolve(__dirname, `../${localConfig.screenshotFolder}/actual/`);
const helpers = require('./helpers');
const localBaseline = path.resolve(__dirname, `../${localConfig.localBaseline}/`);
const baselineFolder = `./${localConfig.localBaseline}/desktop/`;

// Remove and create a new local development baseline
// fs.removeSync(localBaseline);
fs.ensureDirSync(localConfig.localBaseline);

describe('protractor-image-comparison local development initialization', () => {
    beforeEach(done => {
        browser.imageComparson = new imageComparison({
            baselineFolder: baselineFolder,
            debug: false,
            formatImageName: `{tag}-${logName}-{width}x{height}`,
            screenshotPath: localConfig.screenshotFolder
        });
        browser.get(browser.baseUrl)
            .then(() => browser.sleep(500))
            .then(done);
    });

    // Chrome remembers the last postion when the url is loaded again, this will reset it.
    afterEach(() => browser.executeScript('window.scrollTo(0, 0);'));

    const logName = camelCase(browser.logName);
    const resolution = '1366x768';
    const dangerAlert = element(by.css('.uk-alert-danger'));
    const headerElement = element(by.css('h1.uk-heading-large'));
    const examplePage = 'example-page-compare';
    const examplePageFail = `${examplePage}-fail`;
    const dangerAlertElement = 'dangerAlert-compare';
    const dangerAlertElementFail = `${dangerAlertElement}-fail`;
    const exampleFullPage = 'example-fullpage-compare';
    const exampleFullPageFail = `${exampleFullPage}-fail`;

    fit('should save the compare screenshot screenshots', () => {
        browser.imageComparson.saveScreen(examplePage)
            .then(() => {
                fs.copySync(
                    `${screenshotPath}/${examplePage}-${logName}-${resolution}.png`,
                    `${baselineFolder}/${examplePage}-${logName}-${resolution}.png`
                );
                fs.copySync(
                    `${screenshotPath}/${examplePage}-${logName}-${resolution}.png`,
                    `${baselineFolder}/${examplePageFail}-${logName}-${resolution}.png`
                );
            });
    });

    it('should save the default compare element screenshots', () => {
        browser.executeScript('arguments[0].scrollIntoView();', dangerAlert.getWebElement())
            .then(() => browser.sleep(500))
            .then(() => browser.imageComparson.saveElement(dangerAlert, dangerAlertElement))
            .then(() => {
                fs.copySync(
                    `${screenshotPath}/${dangerAlertElement}-${logName}-${resolution}.png`,
                    `${baselineFolder}/${dangerAlertElement}-${logName}-${resolution}.png`
                );
                fs.copySync(
                    `${screenshotPath}/${dangerAlertElement}-${logName}-${resolution}.png`,
                    `${baselineFolder}/${dangerAlertElementFail}-${logName}-${resolution}.png`
                );
                fs.copySync(
                    `${screenshotPath}/${dangerAlertElement}-${logName}-${resolution}.png`,
                    `${baselineFolder}/${dangerAlertElementFail}-ignore-antialiasing-${logName}-${resolution}.png`
                );
            });
    });

    it('should save the resized compare element screenshots', () => {
        browser.imageComparson.saveElement(headerElement, 'resizeDimensions-header-element', {resizeDimensions: 15})
            .then(() => {
                fs.copySync(
                    `${screenshotPath}/resizeDimensions-header-element-${logName}-${resolution}.png`,
                    `${baselineFolder}/resizeDimensions-header-element-${logName}-${resolution}.png`
                );

                return browser.executeScript('arguments[0].scrollIntoView();', dangerAlert.getWebElement());
            })
            .then(() => browser.sleep(500))
            .then(() => browser.imageComparson.saveElement(dangerAlert, `resizeDimensions-${dangerAlertElement}`, {resizeDimensions: 15}))
            .then(() => {
                fs.copySync(
                    `${screenshotPath}/resizeDimensions-${dangerAlertElement}-${logName}-${resolution}.png`,
                    `${baselineFolder}/resizeDimensions-${dangerAlertElement}-${logName}-${resolution}.png`
                );
            });

    });

    it('should save the compare fullpage screenshots', () => {
        browser.imageComparson.saveFullPageScreens(exampleFullPage)
            .then(() => {
                fs.copySync(
                    `${screenshotPath}/${exampleFullPage}-${logName}-${resolution}.png`,
                    `${baselineFolder}/${exampleFullPage}-${logName}-${resolution}.png`
                );
                fs.copySync(
                    `${screenshotPath}/${exampleFullPage}-${logName}-${resolution}.png`,
                    `${baselineFolder}/${exampleFullPageFail}-${logName}-${resolution}.png`
                );
            })
    });
});
