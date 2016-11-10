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

    const browserName = browser.browserName.replace(/ /g, ''),
        logName = camelCase(browser.logName),
        dpr = {
            "chrome": 1,
            "firefox": 1,
            "internetexplorer": 1,
            "microsoftedge": 1,
            "safari": 1
        },
        resolution = '1366x768',
        dangerAlert = element(by.css('.uk-alert-danger')),
        headerElement = element(by.css('h1.page-header'));

    describe('basics', () => {
        it('should save the screen', () => {
            const tagName = 'examplePage';

            browser.imageComparson.saveScreen(tagName)
                .then(() => {
                    expect(fs.existsSync(`${screenshotPath}/${tagName}-${logName}-${resolution}-dpr-${dpr[browserName]}.png`)).toBe(true);
                });
        });

        it('should save element', () => {
            const tagName = 'examplePageElement';

            browser.imageComparson.saveElement(headerElement, tagName)
                .then(() => {
                    expect(fs.existsSync(`${screenshotPath}/${tagName}-${logName}-${resolution}-dpr-${dpr[browserName]}.png`)).toBe(true);
                });
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
                .then(() => {
                    expect(fs.existsSync(`${differencePath}/${examplePageFail}-${logName}-${resolution}-dpr-${dpr[browserName]}.png`)).toBe(true);
                });
        });

        it('should fail comparing with a baseline', () => {
            browser.executeScript('arguments[0].innerHTML = "Test Demo Page";', headerElement.getWebElement());
            expect(browser.imageComparson.checkScreen(examplePageFail)).toBeGreaterThan(0);
        });

        it('should throw an error when no baseline is found', () => {
            browser.imageComparson.checkScreen('noImage')
                .then(() => {
                    fail(new Error('This should not succeed'));
                }, error => {
                    expect(error).toEqual('Image not found, saving current image as new baseline.');
                });
        });
    });

    describe('compare element', () => {
        const dangerAlertElement = 'dangerAlert-compare',
            dangerAlertElementFail = `${dangerAlertElement}-fail`;

        it('should compare successful with a baseline', () => {
            browser.executeScript('arguments[0].scrollIntoView();', dangerAlert.getWebElement());
            expect(browser.imageComparson.checkElement(dangerAlert, dangerAlertElement)).toEqual(0);
        });

        it('should save a difference after failure', () => {
            browser.executeScript('arguments[0].scrollIntoView(); arguments[0].style.color = "#2d7091";', dangerAlert.getWebElement());
            browser.imageComparson.checkElement(dangerAlert, dangerAlertElementFail)
                .then(() => {
                    expect(fs.existsSync(`${differencePath}/${dangerAlertElementFail}-${logName}-${resolution}-dpr-${dpr[browserName]}.png`)).toBe(true);
                });
        });

        it('should fail comparing with a baseline', () => {
            browser.executeScript('arguments[0].scrollIntoView(); arguments[0].style.color = "#2d7091";', dangerAlert.getWebElement());
            expect(browser.imageComparson.checkElement(dangerAlert, dangerAlertElementFail)).toBeGreaterThan(0);
        });

        it('should throw an error when no baseline is found', () => {
            browser.executeScript('arguments[0].scrollIntoView();', dangerAlert.getWebElement())
                .then(() => {
                    browser.imageComparson.checkElement(dangerAlert, 'noImage');
                })
                .then(() => {
                    fail(new Error('This should not succeed'));
                }, error => {
                    expect(error).toEqual('Image not found, saving current image as new baseline.');
                });
        });
    });
});