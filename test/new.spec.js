describe('new image compare', () => {
  beforeEach(async () => {
    await browser.get(browser.baseUrl);
    await browser.sleep(500);
  });

  it('should do a save screen', async () => {
    await browser.imageCompare.saveScreen('tag', {empty: null});
  });
});
