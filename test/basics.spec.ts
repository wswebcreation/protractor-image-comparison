import {$, browser} from 'protractor';
import fileExists from './helpers/fileExists';
import {describe} from 'selenium-webdriver/testing';

describe('image compare basics', () => {
	const headerElement = $('h1.uk-heading-large');
	const firstButton = $('.uk-button:nth-child(1)');
	const logName = browser.logName;
	const resolution = '1366x768';

	beforeEach(async () => {
		await browser.get(browser.baseUrl);
		await browser.sleep(500);
	});

	// Chrome remembers the last postion when the url is loaded again, this will reset it.
	afterEach(() => browser.executeScript('window.scrollTo(0, 0);'));

	describe('save methods', () => {
		it('should do a save screen', async () => {
			const tag = 'examplePage';
			const imageData = await browser.imageComparison.saveScreen('examplePage', {empty: null});
			const filePath = `${imageData.path}/${tag}-${logName}-${resolution}.png`;

			expect(fileExists(filePath)).toBe(true, `File : "${filePath}" could not be found`);
		});

		it('should do a save element', async () => {
			const tag = 'firstButtonElement';
			const imageData = await browser.imageComparison.saveElement(firstButton, tag, {empty: null});
			const filePath = `${imageData.path}/${tag}-${logName}-${resolution}.png`;

			expect(fileExists(filePath)).toBe(true, `File : "${filePath}" could not be found`);
		});

		it('should save a fullpage screenshot', async () => {
			const tag = 'fullPage';
			const imageData = await browser.imageComparison.saveFullPageScreen(tag, {fullPageScrollTimeout: '1500'});
			const filePath = `${imageData.path}/${tag}-${logName}-${resolution}.png`;

			expect(fileExists(filePath)).toBe(true, `File : "${filePath}" could not be found`);
		});
	});

	describe('check methods', () => {
		it('should fail comparing with a baseline', async () => {
			const tag = 'examplePageFail';

			await browser.executeScript('arguments[0].innerHTML = "Test Demo Page";', headerElement.getWebElement());
			expect(await browser.imageComparison.checkScreen(tag)).toBeGreaterThan(0);
		});
	});
});
