import { resolve } from 'path';
import fileExists from './helpers/fileExists';

describe('image compare basics', () => {
	const firstButton = $('.uk-button:nth-child(1)');
	const localConfig = require('../local.config.json');
	const browserName = browser.browserName.toLowerCase();
	const logName = browser.logName;
	const resolution = '1366x768';
	const screenshotPath = resolve(__dirname, `../${ localConfig.screenshotFolder }/${ localConfig.actual }/${ browserName }/`);

	beforeEach(async () => {
		await browser.get(browser.baseUrl);
		await browser.sleep(500);
	});

	// Chrome remembers the last postion when the url is loaded again, this will reset it.
	afterEach(() => browser.executeScript('window.scrollTo(0, 0);'));

	it('should do a save screen', async () => {
		const tag = 'examplePage';
		const imageData = await browser.imageCompare.saveScreen('examplePage', { empty: null });

		expect(fileExists(`${ imageData.path }/${ tag }-${ logName }-${ resolution }.png`)).toBe(true);
	});

	it('should do a save element', async () => {
		const tag = 'firstButtonElement';
		const imageData = await browser.imageCompare.saveElement(firstButton, tag, { empty: null });

		expect(fileExists(`${ imageData.path }/${ tag }-${ logName }-${ resolution }.png`)).toBe(true);
	});

	it('should save a fullpage screenshot', async () => {
		const tag = 'fullPage';
		const imageData = await browser.imageCompare.saveFullPageScreen(tag, { fullPageScrollTimeout: '1500' });

		expect(fileExists(`${ imageData.path }/${ tag }-${ logName }-${ resolution }.png`)).toBe(true);
	});
});
