'use strict';

let fs = require('fs'),
    camelCase = require('camel-case'),
    imageComparison = require('../'),
    path = require('path'),
    screenshotPath = path.resolve(__dirname, '../.tmp/actual/'),
    differencePath = path.resolve(__dirname, '../.tmp/diff/');

describe('image-comparison', () => {

    const logName = camelCase(browser.logName),
        devices = {
            iPhone_6SimulatorSafari: {
                blockOut: [{x: 0, y: 0, width: 750, height: 40}],
                name: `${logName}-375x667-dpr-2`
            },
            iPadAir_2SimulatorSafari: {
                blockOut: [{x: 0, y: 0, width: 1536, height: 40}],
                name: `${logName}-768x1024-dpr-2`
            },
            nexus_5ByGoogleADB: {
                blockOut: [{x: 0, y: 0, width: 1080, height: 72}],
                name: `${logName}-360x640-dpr-3`
            },
            nexus_5ByGoogleChromeDriver: {
                blockOut: [{x: 0, y: 0, width: 1080, height: 72}],
                name: `${logName}-360x640-dpr-3`
            },
            perfectoAppleIPhone_7Safari: {
                blockOut: [{x: 0, y: 0, width: 750, height: 40}, {x: 0, y: 1246, width: 750, height: 88}],
                name: `${logName}-375x667-dpr-2`
            },
            perfectoSamsungGalaxyS6Chrome: {
                blockOut: [{x: 0, y: 0, width: 1440, height: 96}],
                name: `${logName}-360x640-dpr-4`
            }
        },
        dangerAlert = element(by.css('.uk-alert-danger')),
        headerElement = element(by.css('h1.page-header'));

    let ADBScreenshot;

    beforeEach(function () {
        browser.getProcessedConfig()
            .then(_ => {
                ADBScreenshot = _.capabilities.nativeWebScreenshot || false;

                browser.imageComparson = new imageComparison({
                    baselineFolder: './test/baseline/mobile/',
                    formatImageName: `{tag}-${logName}-{width}x{height}-dpr-{dpr}`,
                    screenshotPath: './.tmp/',
                    nativeWebScreenshot: ADBScreenshot
                });

                return browser.get(browser.baseUrl);
            })
            .then(() => browser.sleep(1000));
    });


    it('should save the screen', () => {
        const tagName = 'examplePage';

        browser.imageComparson.saveScreen(tagName)
            .then(() => {
                expect(fs.existsSync(`${screenshotPath}/${tagName}-${devices[logName]['name']}.png`)).toBe(true);
            });
    });

    it('should save element', () => {
        const tagName = 'examplePageElement';

        browser.imageComparson.saveElement(headerElement, tagName)
            .then(() => {
                expect(fs.existsSync(`${screenshotPath}/${tagName}-${devices[logName]['name']}.png`)).toBe(true);
            });
    });

    describe('compare screen', () => {
        const examplePage = 'example-page-compare',
            examplePageFail = `${examplePage}-fail`;

        it('should compare successful with a baseline', () => {
            expect(browser.imageComparson.checkScreen(examplePage,
                {blockOut: devices[logName]['blockOut']}))
                .toEqual(0);
        });

        it('should save a difference after failure', () => {
            browser.executeScript('arguments[0].innerHTML = "Test Demo Page";', headerElement.getWebElement());
            browser.imageComparson.checkScreen(examplePageFail)
                .then(() => {
                    expect(fs.existsSync(`${differencePath}/${examplePageFail}-${devices[logName]['name']}.png`)).toBe(true);
                });
        });

        it('should fail comparing with a baseline', () => {
            browser.executeScript('arguments[0].innerHTML = "Test Demo Page";', headerElement.getWebElement());
            expect(browser.imageComparson.checkScreen(examplePageFail)).toBeGreaterThan(0);
        });

        it('should throw an error when no baseline is found', () => {
            browser.imageComparson.checkScreen('noImage')
                .then(() => {
                    fail(new Error('This should not succeed'))
                }, error => {
                    expect(error).toEqual('Image not found, saving current image as new baseline.');
                });
        });
    });

    describe('compare element', () => {
        const dangerAlertElement = 'dangerAlert-compare',
            dangerAlertElementFail = `${dangerAlertElement}-fail`;

        it('should compare successful with a baseline', () => {
            browser.executeScript('arguments[0].scrollIntoView();', dangerAlert.getWebElement())
                .then(() => {
                    if (ADBScreenshot) {
                        browser.sleep(1000);
                    }
                    expect(browser.imageComparson.checkElement(dangerAlert, dangerAlertElement)).toEqual(0);
                })
        });

        it('should save a difference after failure', () => {
            browser.executeScript('arguments[0].scrollIntoView(); arguments[0].style.color = "#2d7091";', dangerAlert.getWebElement())
                .then(() => {
                    browser.imageComparson.checkElement(dangerAlert, dangerAlertElementFail)
                })
                .then(() => {
                    expect(fs.existsSync(`${differencePath}/${dangerAlertElementFail}-${devices[logName]['name']}.png`)).toBe(true);
                });
        });

        it('should fail comparing with a baseline', () => {
            browser.executeScript('arguments[0].scrollIntoView(); arguments[0].style.color = "#2d7091";', dangerAlert.getWebElement())
                .then(() => {
                    if (ADBScreenshot) {
                        browser.sleep(1000);
                    }
                    expect(browser.imageComparson.checkElement(dangerAlert, dangerAlertElementFail)).toBeGreaterThan(0);
                });

        });

        it('should throw an error when no baseline is found', () => {
            browser.executeScript('arguments[0].scrollIntoView();', dangerAlert.getWebElement())
                .then(() => {
                    browser.imageComparson.checkElement(dangerAlert, 'noImage')
                })
                .then(() => {
                    fail(new Error('This should not succeed'))
                }, error => {
                    expect(error).toEqual('Image not found, saving current image as new baseline.');
                });
        });
    });
});
