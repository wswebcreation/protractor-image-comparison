'use strict';
let fs = require('fs'),
    camelCase = require('camel-case'),
    imageComparison = require('../'),
    path = require('path'),
    screenshotPath = path.resolve(__dirname, '../.tmp/actual/'),
    differencePath = path.resolve(__dirname, '../.tmp/diff/');

describe('protractor-image-comparison', () => {
    beforeEach(() => {
        browser.imageComparson = new imageComparison({
            baselineFolder: './test/baseline/desktop/',
            formatImageName: `{tag}-${logName}-{width}x{height}-dpr-{dpr}`,
            screenshotPath: './.tmp/'
        });

        browser.get(browser.baseUrl)
            .then(()=> browser.sleep(500));
    });

    // Chrome remembers the last postion when the url is loaded again, this will reset it.
    afterEach(() => browser.executeScript('window.scrollTo(0, 0);'));

    const logName = camelCase(browser.logName),
        resolution = '1366x768',
        dangerAlert = element(by.css('.uk-alert-danger')),
        headerElement = element(by.css('h1.uk-heading-large'));

    describe('basics', () => {
        it('should save the screen', () => {
            const tagName = 'examplePage';

            browser.imageComparson.saveScreen(tagName)
                .then(() => expect(fs.existsSync(`${screenshotPath}/${tagName}-${logName}-${resolution}-dpr-1.png`)).toBe(true));
        });

        it('should save element', () => {
            const tagName = 'examplePageElement';

            browser.imageComparson.saveElement(headerElement, tagName)
                .then(() => expect(fs.existsSync(`${screenshotPath}/${tagName}-${logName}-${resolution}-dpr-1.png`)).toBe(true));
        });
    });

    describe('compare screen', () => {
        const examplePage = 'example-page-compare',
            examplePageFail = `${examplePage}-fail`;

        it('should compare successful with a baseline', () => {
            expect(browser.imageComparson.checkScreen(examplePage)).toEqual(0);
        });

        it('should save a difference after failure', () => {
            browser.executeScript('arguments[0].innerHTML = "Test Demo Page";', headerElement.getWebElement());
            browser.imageComparson.checkScreen(examplePageFail)
                .then(() => expect(fs.existsSync(`${differencePath}/${examplePageFail}-${logName}-${resolution}-dpr-1.png`)).toBe(true));
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
        const dangerAlertElement = 'dangerAlert-compare',
            dangerAlertElementFail = `${dangerAlertElement}-fail`;

        it('should compare successful with a baseline', () => {
            browser.executeScript('arguments[0].scrollIntoView();', dangerAlert.getWebElement())
                .then(() => browser.sleep(500))
                .then(() => expect(browser.imageComparson.checkElement(dangerAlert, dangerAlertElement)).toEqual(0));
        });

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
                .then(() => expect(fs.existsSync(`${differencePath}/${dangerAlertElementFail}-${logName}-${resolution}-dpr-1.png`)).toBe(true));
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

        if (browser.browserName === 'chrome') {
            describe('resemble api', () => {
                it('should fail comparing 2 non identical images with each other with ignoreAntialiasing enabled', () => {
                    browser.executeScript('arguments[0].scrollIntoView(); arguments[0].style.color = "#2d7091";', dangerAlert.getWebElement())
                        .then(() => browser.sleep(500))
                        .then(() => expect(browser.imageComparson.checkElement(dangerAlert, `${dangerAlertElementFail}-ignore-antialiasing`, {ignoreAntialiasing: true})).toEqual(0.14));
                });

                it('should fail comparing 2 non identical images with each other with ignoreColors enabled', () => {
                    browser.executeScript('arguments[0].scrollIntoView(); arguments[0].style.color = "#2d7091";', dangerAlert.getWebElement())
                        .then(() => browser.sleep(500))
                        .then(() => expect(browser.imageComparson.checkElement(dangerAlert, `${dangerAlertElementFail}-ignore-colors`, {ignoreColors: true})).toEqual(1.08));
                });
            });
        }
    });
});