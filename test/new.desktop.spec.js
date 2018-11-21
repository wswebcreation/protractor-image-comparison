import fileExists from './helpers/fileExists';

/**
 * These tests need to be changed to `check` tests in the future, for know the saveElement is sufficient
 */
describe('image compare basics', () => {
	const firstButton = $('.uk-button:nth-child(1)');

  beforeEach(async () => {
    await browser.get(browser.baseUrl);
    await browser.sleep(500);
  });

	// Chrome remembers the last postion when the url is loaded again, this will reset it.
	afterEach(() => browser.executeScript('window.scrollTo(0, 0);'));

	it('should do a save screen', async () => {
		await browser.imageCompare.saveScreen('examplePage', { empty: null });
	});

	it('should do a save element', async () => {
		await browser.imageCompare.saveElement(firstButton, 'firstButtonElement', { empty: null });
	});

  xit('should do a save element with custom dimensions the deprecated way', async () => {
    await browser.imageCompare.saveElement(firstButton, 'resizeDimensions-firstButtonElement-deprecated', {resizeDimensions: 15});
  });

  xit('should do a save element with custom dimensions the new way', async () => {
    await browser.imageCompare.saveElement(firstButton, 'resizeDimensions-firstButtonElement-new', {resizeDimensions: {left: 15, top: 250}});
  });

	it('should save a fullpage screenshot', async () => {
		await browser.imageCompare.saveFullPageScreen('fullPage', { fullPageScrollTimeout: '1500' });
	});
});
