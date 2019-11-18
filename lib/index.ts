import { browser } from 'protractor';
import { ClassOptions } from 'webdriver-image-comparison';
import ProtractorImageComparison from './protractor.image.compare';

/**
 * Sets up plugins before tests are run. This is called after the WebDriver
 * session has been started, but before the test framework has been set up.
 */
async function setup() {
	const configOptions: ClassOptions = typeof this.config.options === 'object' ? this.config.options : {};

	browser.imageComparison = await ProtractorImageComparison.build(configOptions);
}

exports.setup = setup;
