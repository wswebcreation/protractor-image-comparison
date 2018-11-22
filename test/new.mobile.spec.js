describe('new image compare', () => {
	const logName = browser.logName;
  const firstButton = $('.uk-button:nth-child(1)');

  beforeEach(async () => {
    await browser.get(browser.baseUrl);
    await browser.sleep(500);
  });

  it('should do a mobile save screen', async () => {
    await browser.imageCompare.saveScreen('examplePage', {empty: null});
  });

  it('should do a save element', async () => {
    await browser.imageCompare.saveElement(firstButton, 'firstButtonElement', {empty: null});
  });

  xit('should do a save element with custom dimensions the deprecated way', async () => {
    await browser.imageCompare.saveElement(firstButton, 'resizeDimensions-firstButtonElement-deprecated', {resizeDimensions: 15});
  });

  xit('should do a save element with custom dimensions the new way', async () => {
    await browser.imageCompare.saveElement(firstButton, 'resizeDimensions-firstButtonElement-new', {resizeDimensions: {left: 15, top: 250}});
  });

  it('should save a fullpage screenshot', async () => {
    await browser.imageCompare.saveFullPageScreen('fullPage', {fullPageScrollTimeout: '1500'});
  });
});
