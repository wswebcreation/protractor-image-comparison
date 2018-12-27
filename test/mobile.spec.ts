import {$, browser} from 'protractor';

describe('new image compare', () => {
	const examplePage = 'examplePage';
	const fullPage = 'fullPage';
	const firstButton = $('.uk-button:nth-child(1)');

	beforeEach(async () => {
		await browser.get(browser.baseUrl);
		await browser.sleep(500);
	});

	// Chrome remembers the last postion when the url is loaded again, this will reset it.
	afterEach(() => browser.executeScript('window.scrollTo(0, 0);'));

	// describe('save screen', () => {
	// 	it('should do a mobile save screen', async () => {
	// 		await browser.imageComparison.saveScreen(examplePage, { empty: null });
	// 	});
	//
	// 	it('should do a save element', async () => {
	// 		await browser.imageComparison.saveElement(firstButton, 'firstButtonElement', { empty: null });
	// 	});
	//
	// 	xit('should do a save element with custom dimensions the deprecated way', async () => {
	// 		await browser.imageComparison.saveElement(firstButton, 'resizeDimensions-firstButtonElement-deprecated', { resizeDimensions: 15 });
	// 	});
	//
	// 	xit('should do a save element with custom dimensions the new way', async () => {
	// 		await browser.imageComparison.saveElement(firstButton, 'resizeDimensions-firstButtonElement-new', {
	// 			resizeDimensions: {
	// 				left: 15,
	// 				top: 250
	// 			}
	// 		});
	// 	});
	//
	// 	it('should save a fullpage screenshot', async () => {
	// 		await browser.imageComparison.saveFullPageScreen('fullPage', { fullPageScrollTimeout: '1500' });
	// 	});
	// });

	describe('compare screen', () => {
		it('should compare successful with a baseline', async () => {
			expect(await browser.imageComparison.checkScreen(examplePage)).toEqual(0);
		});
	});

	describe('compare element', () => {
		it('should compare successful with a baseline', async () => {
			expect(await browser.imageComparison.checkElement(firstButton, 'firstButtonElement')).toEqual(0);
		});
	});

	describe('compare fullpage', () => {
		it('should compare successful with a baseline', async () => {
			expect(await browser.imageComparison.checkFullPageScreen('fullPage', {fullPageScrollTimeout: '1500'})).toEqual(0);
		});
	});
});
