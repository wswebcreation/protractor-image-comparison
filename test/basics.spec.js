import { resolve } from 'path';
import fileExists from './helpers/fileExists';

xdescribe('image compare basics', () => {
	const firstButton = $('.uk-button:nth-child(1)');
	const localConfig = require('../local.config.json');
	const browserName = browser.browserName.toLowerCase();
	const logName = browser.logName;
	const resolution = '1366x768';
	const screenshotPath = resolve(__dirname, `../${localConfig.screenshotFolder}/${localConfig.actual}/${browserName}/`);

	beforeEach(async () => {
		await browser.get(browser.baseUrl);
		await browser.sleep(500);
	});

	// Chrome remembers the last postion when the url is loaded again, this will reset it.
	afterEach(() => browser.executeScript('window.scrollTo(0, 0);'));

	it('should do a save screen', async () => {
		await browser.imageCompare.saveScreen('examplePage', { empty: null });
		expect(fileExists(`${screenshotPath}/examplePage-${logName}-${resolution}.png`)).toBe(true);
	});

	it('should do a save element', async () => {
		await browser.imageCompare.saveElement(firstButton, 'firstButtonElement', { empty: null });
		expect(fileExists(`${screenshotPath}/firstButtonElement-${logName}-${resolution}.png`)).toBe(true);
	});

	it('should save a fullpage screenshot', async () => {
		await browser.imageCompare.saveFullPageScreen('fullPage', { fullPageScrollTimeout: '1500' });
		expect(fileExists(`${screenshotPath}/fullPage-${logName}-${resolution}.png`)).toBe(true);
	});
});
