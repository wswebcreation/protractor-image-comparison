describe('image compare basics', () => {
  const headerElement = $('h1.uk-heading-large');

  beforeEach(async () => {
    await browser.get(browser.baseUrl);
    await browser.sleep(500);
  });

	// Chrome remembers the last postion when the url is loaded again, this will reset it.
	afterEach(() => browser.executeScript('window.scrollTo(0, 0);'));

  it('should do a save element with custom dimensions the deprecated way', async () => {
    await browser.imageCompare.saveElement(headerElement, 'resizeDimensions-examplePageElement-deprecated', {resizeDimensions: 15});
  });

  it('should do a save element with custom dimensions the new way', async () => {
    await browser.imageCompare.saveElement(headerElement, 'resizeDimensions-examplePageElement-new', {resizeDimensions: {left: 15, top: 250}});
  });
});
