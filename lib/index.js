import ProtractorImageComparison from "./protractor.image.compare";


let myPlugin = {
  async setup() {
    browser.imageCompare = new ProtractorImageComparison({
      baselineFolder: './localBaseline',
      debug: false,
      formatImageName: `{tag}-{width}x{height}`,
      screenshotPath: '.tmp/'
    });
  }
};

module.exports = myPlugin;
