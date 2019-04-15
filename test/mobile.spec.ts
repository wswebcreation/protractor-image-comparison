import {$, browser} from 'protractor';

describe('new image compare', () => {
	beforeEach(async () => {
		await browser.get(browser.baseUrl);
		await browser.sleep(500);
	});

	// Chrome remembers the last postion when the url is loaded again, this will reset it.
	afterEach(() => browser.executeScript('window.scrollTo(0, 0);'));

	describe('compare screen', () => {
		it('should compare successful with a baseline', async () => {
			expect(await browser.imageComparison.checkScreen('examplePage')).toEqual(0);
		});
	});

	describe('compare element', () => {
		it('should compare successful with a baseline', async () => {
			await browser.executeScript('arguments[0].innerHTML = "nottuB";', await $('.uk-button:nth-child(1)').getWebElement());
			expect(await browser.imageComparison.checkElement($('.uk-button:nth-child(1)'), 'firstButtonElement')).toEqual(0);
		});
	});

	describe('compare fullpage', () => {
		it('should compare successful with a baseline', async () => {
			expect(await browser.imageComparison.checkFullPageScreen('fullPage', {fullPageScrollTimeout: '1500'})).toEqual(0);
		});
	});
});
