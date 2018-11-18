import ProtractorImageComparison from './protractor.image.compare';

/**
 * Sets up plugins before tests are run. This is called after the WebDriver
 * session has been started, but before the test framework has been set up.
 *
 * @param {object} options The options of the module
 *
 * @return {Promise<void>}
 */
async function setup(options) {
	browser.imageCompare = new ProtractorImageComparison({
		...(this.config.options.baselineFolder ? { baselineFolder: this.config.options.baselineFolder } : {}),
		...(this.config.options.debug ? { debug: this.config.options.debug } : {}),
		...(this.config.options.formatImageName ? { formatImageName: this.config.options.formatImageName } : {}),
		...(this.config.options.screenshotPath ? { screenshotPath: this.config.options.screenshotPath } : {}),
		savePerInstance: this.config.options.savePerInstance || false,
	});
}

exports.setup = setup;
