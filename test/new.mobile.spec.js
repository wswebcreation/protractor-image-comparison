describe('new image compare', () => {
	const logName = browser.logName;
	const devices = {
		iPhone8: {
			name: `${logName}-375x667-dpr-2`
		},
		iPadAir_2SimulatorSafari: {
			name: `${logName}-768x1024-dpr-2`
		},
		nexus_5ByGoogleAdb: {
			name: `${logName}-360x640-dpr-3`
		},
	};
  const headerElement = $('h1.uk-heading-large');

  beforeEach(async () => {
    await browser.get(browser.baseUrl);
    await browser.sleep(500);
  });

  it('should do a mobile save screen', async () => {
    await browser.imageCompare.saveScreen('examplePage', {empty: null});
  });

  fit('should do a save element', async () => {
    await browser.imageCompare.saveElement(headerElement, 'examplePageElement', {empty: null});
  });

  it('should do a save element with custom dimensions the deprecated way', async () => {
    await browser.imageCompare.saveElement(headerElement, 'resizeDimensions-examplePageElement-deprecated', {resizeDimensions: 15});
  });

  it('should do a save element with custom dimensions the new way', async () => {
    await browser.imageCompare.saveElement(headerElement, 'resizeDimensions-examplePageElement-new', {resizeDimensions: {left: 15, top: 250}});
  });

  it('should save a fullpage screenshot', async () => {
    await browser.imageCompare.saveFullPageScreen('fullPage', {fullPageScrollTimeout: '1500'});
  });
});
