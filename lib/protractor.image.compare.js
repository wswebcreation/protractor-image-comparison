import BaseClass from './base';
import saveElement from './commands/saveElement';
import saveScreen from './commands/saveScreen';
import saveFullPageScreen from './commands/saveFullPageScreen';

export default class ProtractorImageComparison extends BaseClass {
	constructor(options) {
		super(options);
	}

	/**
	 * Saves an image of an element
	 *
	 * @param {ElementFinder} element                     The element
	 * @param {string}        tag                         The tag that is used to name the image
	 * @param {object}        options                     The options available for this method
	 * @param {boolean}       options.disableCSSAnimation Disable all css animations, this is optional
	 * @param {number}        options.resizeDimensions    The resize dimension, this is optional
	 *
	 * @return {Promise<string>}
	 */
	async saveElement(element, tag, options = {}) {
		browser.instanceData = browser.instanceData || await getInstanceData();

		return saveElement(
			{
				executor: browser.executeScript,
				screenShot: browser.takeScreenshot
			},
			browser.instanceData,
			this.folders,
			await element.getWebElement(),
			tag,
			{ ...this.defaultOptions, ...options },
		);
	}

	/**
	 * Saves an image of a viewport
	 *
	 * @param {string}  tag                         The tag that is used to name the image
	 * @param {object}  options                     The options available for this method
	 * @param {boolean} options.disableCSSAnimation Disable all css animations, this is optional
	 * @param {boolean} options.hideScrollBars      Hide scrollbars, this is optional
	 *
	 * @return {Promise<string>}
	 */
	async saveScreen(tag, options = {}) {
		browser.instanceData = browser.instanceData || await getInstanceData();

		return saveScreen(
			{
				executor: browser.executeScript,
				screenShot: browser.takeScreenshot
			},
			browser.instanceData,
			this.folders,
			tag,
			{ ...this.defaultOptions, ...options },
		);
	}

	/**
	 * Saves an image of the complete screen
	 *
	 * @param {string}  tag                           The tag that is used to name the image
	 * @param {object}  options                       The options available for this method
	 * @param {boolean} options.disableCSSAnimation   Disable all css animations, this is optional
	 * @param {boolean} options.fullPageScrollTimeout The scroll timeout, this is optional
	 * @param {boolean} options.hideScrollBars        Hide scrollbars, this is optional
	 *
	 * @return {Promise<string>}
	 */
	async saveFullPageScreen(tag, options = {}) {
		browser.instanceData = browser.instanceData || await getInstanceData();

		return saveFullPageScreen(
			{
				executor: browser.executeScript,
				screenShot: browser.takeScreenshot
			},
			browser.instanceData,
			this.folders,
			tag,
			{ ...this.defaultOptions, ...options },
		);
	}
}

/**
 * Get the instance data
 *
 * @returns {Promise<{
 *    browserName: string,
 *    deviceName: string,
 *    logName: string,
 *    name: string,
 *    nativeWebScreenshot: boolean,
 *    platformName: string
 *  }>}
 */
async function getInstanceData() {
	const instanceConfig = (await browser.getProcessedConfig()).capabilities;

	// Substract the needed data from the running instance
	const browserName = (instanceConfig.browserName || '').toLowerCase();
	const logName = instanceConfig.logName || '';
	const name = instanceConfig.name || '';

	// For mobile
	const platformName = (instanceConfig.platformName || '').toLowerCase();
	const deviceName = (instanceConfig.deviceName || '').toLowerCase();
	const nativeWebScreenshot = !!instanceConfig.nativeWebScreenshot;

	return {
		browserName,
		deviceName,
		logName,
		name,
		nativeWebScreenshot,
		platformName,
	}
}
