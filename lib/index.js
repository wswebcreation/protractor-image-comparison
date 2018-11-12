import ProtractorImageComparison from "./protractor.image.compare";


let myPlugin = {
  async setup() {
    browser.imageCompare = new ProtractorImageComparison({
      baselineFolder: './localBaseline',
      debug: false,
			formatImageName: `{tag}-{logName}-{browserName}-{width}x{height}-dpr-{dpr}`,
      screenshotPath: '.tmp/'
    });
  }
};

module.exports = myPlugin;
