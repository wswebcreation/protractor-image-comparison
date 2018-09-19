'use strict';

const camelCase = require('camel-case');
const fs = require('fs-extra');
const imageComparison = require('../');
const localConfig = require('../local.config.json');
const path = require('path');
const screenshotPath = path.resolve(__dirname, `../${localConfig.screenshotFolder}/actual/`);
const differencePath = path.resolve(__dirname, `../${localConfig.screenshotFolder}/diff/`);
const helpers = require('./helpers');

// Determine if a localBaseline is created
const environment = process.argv.slice(3, 4)[0].split('=')[1];
const localBaseline = path.resolve(__dirname, `../${localConfig.localBaseline}/`);
let baselineFolder;

if (environment === 'saucelabs') {
    baselineFolder = './test/baseline/desktop/';
} else {
    baselineFolder = `./${localConfig.localBaseline}/desktop/`;
}

describe('protractor-image-comparison', () => {
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
    const dangerAlert = $('.uk-alert-danger');
    const headerElement = $('h1.uk-heading-large');
    const canvasElement = $('#canvasBlocks');
    const canvasBlocks = 'canvasBlocks';
    const dangerAlertElement = 'dangerAlert-compare';
    const dangerAlertElementFail = `${dangerAlertElement}-fail`;
    const exampleFullPage = 'example-fullpage-compare';
    const exampleFullPageFail = `${exampleFullPage}-fail`;
    const examplePage = 'example-page-compare';
    const examplePageFail = `${examplePage}-fail`;
    const tagName = 'examplePage';

    // Only test this on chrome, also for ci
    if (browser.browserName === 'chrome') {
        describe('basics', () => {
            it('should save the screen', () => {

                browser.imageComparson.saveScreen(tagName)
                    .then(() => expect(helpers.fileExistSync(`${screenshotPath}/${tagName}-${logName}-${resolution}.png`)).toBe(true));
            });

            it('should save an element', () => {
                const tagName = 'examplePageElement';

                browser.imageComparson.saveElement(headerElement, tagName)
                    .then(() => expect(helpers.fileExistSync(`${screenshotPath}/${tagName}-${logName}-${resolution}.png`)).toBe(true));
            });

            it('should save a fullpage screenshot', () => {
                const tagName = 'fullPage';

                browser.imageComparson.saveFullPageScreens(tagName, {timeout: '1500a'})
                    .then(() => expect(helpers.fileExistSync(`${screenshotPath}/${tagName}-${logName}-${resolution}.png`)).toBe(true));

            });

            it('should copy an image to the baseline when autoSaveBaseline is true', () => {
                const tagName = 'autoSaveBaseline';
                const autoSaveBaselineFolder = path.resolve(__dirname, '../.tmp/baseline/desktop/');

                browser.imageComparson = new imageComparison({
                    baselineFolder: autoSaveBaselineFolder,
                    autoSaveBaseline: true,
                    formatImageName: `{tag}-${logName}-{width}x{height}`,
                    screenshotPath: localConfig.screenshotFolder
                });

                expect(helpers.fileExistSync(`${baselineFolder}/${tagName}-${logName}-${resolution}.png`)).toBe(false, 'Error: Baseline image already exists.');
                browser.imageComparson.checkScreen(tagName)
                    .then(() => expect(helpers.fileExistSync(`${autoSaveBaselineFolder}/${tagName}-${logName}-${resolution}.png`)).toBe(true, 'File is saved in the baseline'));
            });

            if (environment === 'saucelabs') {
                describe('resemble api', () => {
                    it('should succeed comparing 2 non identical images with each other with ignoreAntialiasing enabled', () => {
                        browser.executeScript('arguments[0].scrollIntoView(); arguments[0].style.color = "#2d7091";', dangerAlert.getWebElement())
                            .then(() => browser.sleep(500))
                            .then(() => expect(browser.imageComparson.checkElement(dangerAlert, `${dangerAlertElementFail}-ignore-antialiasing`, {ignoreAntialiasing: true})).toEqual(0));
                    });
                });
            }

            it('should not save a difference when mismatches percentage less than saveAboveTolerance value', () => {
                browser.executeScript('arguments[0].innerHTML = "Test Demo Page";', headerElement.getWebElement());
                browser.imageComparson.checkScreen(examplePageFail, {saveAboveTolerance: 3})
                    .then(() => expect(helpers.fileExistSync(`${differencePath}/${examplePageFail}-${logName}-${resolution}.png`)).toBe(false));
            });

            it('should not save a difference when mismatches percentage less than saveAboveTolerance value', () => {
                browser.executeScript('arguments[0].scrollIntoView(); arguments[0].style.color = "#2d7091";', dangerAlert.getWebElement());
                browser.imageComparson.checkElement(dangerAlert, dangerAlertElementFail, {saveAboveTolerance: 3})
                    .then(() => expect(helpers.fileExistSync(`${differencePath}/${dangerAlertElementFail}-${logName}-${resolution}.png`)).toBe(false));
            });

            it('should give a bigger accurate percentage when rawMisMatchPercentage is true', () => {
                browser.imageComparson = new imageComparison({
                    baselineFolder: baselineFolder,
                    debug: false,
                    formatImageName: `{tag}-${logName}-{width}x{height}`,
                    rawMisMatchPercentage: true,
                    screenshotPath: localConfig.screenshotFolder
                });
                browser.executeScript('arguments[0].innerHTML = "Test Demo Page";', headerElement.getWebElement())
                    .then(() => browser.imageComparson.checkScreen(examplePageFail))
                    .then((rawMisMatchPercentage) => expect(rawMisMatchPercentage.toString().length).toBeGreaterThan(4));
            });
        });
    }

    describe('compare screen', () => {

        it('should compare successful with a baseline', () => {
            expect(browser.imageComparson.checkScreen(examplePage)).toEqual(0);
        });

        it('should save a difference after failure', () => {
            browser.executeScript('arguments[0].innerHTML = "Test Demo Page";', headerElement.getWebElement());
            browser.imageComparson.checkScreen(examplePageFail)
                .then(() => expect(helpers.fileExistSync(`${differencePath}/${examplePageFail}-${logName}-${resolution}.png`)).toBe(true));
        });

        it('should fail comparing with a baseline', () => {
            browser.executeScript('arguments[0].innerHTML = "Test Demo Page";', headerElement.getWebElement())
                .then(() => expect(browser.imageComparson.checkScreen(examplePageFail)).toBeGreaterThan(0));
        });

        it('should throw an error when no baseline is found', () => {
            browser.imageComparson.checkScreen('noImage')
                .then(() => fail(new Error('This should not succeed')))
                .catch((error) => expect(error).toEqual('Image not found, saving current image as new baseline.'));
        });
    });

    describe('compare element', () => {
        it('should compare successful with a baseline', () => {
            browser.executeScript('arguments[0].scrollIntoView();', dangerAlert.getWebElement())
                .then(() => browser.sleep(500))
                .then(() => expect(browser.imageComparson.checkElement(dangerAlert, dangerAlertElement)).toEqual(0));
        });
        if (browser.logName !== 'IE11' && browser.logName !== 'Safari 9') {
            it('should compare a canvas screenshot successful with a baseline', () => {
                browser.executeScript('arguments[0].scrollIntoView();', canvasElement.getWebElement())
                    .then(() => browser.sleep(500))
                    .then(() => expect(browser.imageComparson.checkElement(canvasElement, `${canvasBlocks}-compare`, {canvasScreenshot: true})).toEqual(0));

            });
        }

        it('should compare successful with a baseline with custom dimensions that is NOT scrolled', () => {
            expect(browser.imageComparson.checkElement(headerElement, 'resizeDimensions-header-element', {resizeDimensions: 15})).toEqual(0);
        });

        it('should compare successful with a baseline with custom dimensions that is scrolled', () => {
            browser.executeScript('arguments[0].scrollIntoView();', dangerAlert.getWebElement())
                .then(() => browser.sleep(500))
                .then(() => expect(browser.imageComparson.checkElement(dangerAlert, `resizeDimensions-${dangerAlertElement}`, {resizeDimensions: 15})).toEqual(0));

        });

        it('should save a difference after failure', () => {
            browser.executeScript('arguments[0].scrollIntoView(); arguments[0].style.color = "#2d7091";', dangerAlert.getWebElement());
            browser.imageComparson.checkElement(dangerAlert, dangerAlertElementFail)
                .then(() => expect(helpers.fileExistSync(`${differencePath}/${dangerAlertElementFail}-${logName}-${resolution}.png`)).toBe(true));
        });

        it('should fail comparing with a baseline', () => {
            browser.executeScript('arguments[0].scrollIntoView(); arguments[0].style.color = "#2d7091";', dangerAlert.getWebElement())
                .then(() => browser.sleep(500))
                .then(() => expect(browser.imageComparson.checkElement(dangerAlert, dangerAlertElementFail)).toBeGreaterThan(0));
        });

        it('should throw an error when no baseline is found', () => {
            browser.executeScript('arguments[0].scrollIntoView();', dangerAlert.getWebElement())
                .then(() => browser.imageComparson.checkElement(dangerAlert, 'noImage'))
                .then(() => fail(new Error('This should not succeed')))
                .catch((error) => expect(error).toEqual('Image not found, saving current image as new baseline.'));
        });
    });

    describe('compare fullpage screenshot', () => {

        it('should compare successful with a baseline', () => {
            expect(browser.imageComparson.checkFullPageScreen(exampleFullPage)).toEqual(0);
        });

        it('should fail comparing with a baseline', () => {
            browser.executeScript('arguments[0].innerHTML = "Test Demo Page"; arguments[1].style.color = "#2d7091";', headerElement.getWebElement(), dangerAlert.getWebElement())
                .then(() => expect(browser.imageComparson.checkFullPageScreen(exampleFullPageFail)).toBeGreaterThan(0));
        });
    });
});
