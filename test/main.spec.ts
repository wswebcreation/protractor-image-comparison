import { $, browser } from 'protractor';


describe('protractor-image-comparison', () => {
	beforeEach(async () => {
		await browser.get(browser.baseUrl);
		await browser.sleep(500);
	});

	// Chrome remembers the last postion when the url is loaded again, this will reset it.
	afterEach(() => browser.executeScript('window.scrollTo(0, 0);'));

	describe('library methods', () => {
		it('should take screen and compare', async () => {
			expect(await browser.imageComparison.checkScreen('examplePage')).toEqual(0);
		});

		it('should take element and compare', async () => {
			expect(
				await browser.imageComparison.checkElement($('.uk-button:nth-child(1)'), 'firstButtonElement')
			).toEqual(0);
		});
		
		it('should take full page screen and compare', async () => {
			expect(
				await browser.imageComparison.checkFullPageScreen('fullPage', { fullPageScrollTimeout: 1500 })
			).toEqual(0);
		});
	});
});
