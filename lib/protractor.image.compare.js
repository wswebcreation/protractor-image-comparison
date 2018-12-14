import BaseClass from './base';
import saveElement from './commands/saveElement';
import saveScreen from './commands/saveScreen';
import saveFullPageScreen from './commands/saveFullPageScreen';
import checkScreen from './commands/checkScreen';
import checkElement from './commands/checkElement';
import checkFullPageScreen from './commands/checkFullPageScreen';

// @TODO: refactor the options, the default options should only be used later on

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

	/**
	 * Compare an image of an element
	 *
	 * @param {element} element                        The element
	 * @param {string}  tag                            The tag that is used to name the image
	 * @param {object}  options                        The options available for this method
	 * @param {boolean} options.disableCSSAnimation    Disable all css animations, this is optional
	 * @param {number}  options.resizeDimensions       The resize dimension, this is optional
	 * @param {boolean} options.disableCSSAnimation    Disable all css animations, this is optional
	 * @param {boolean} options.hideScrollBars         Hide scrollbars, this is optional
	 * @param {object}  options.blockOut               Blockout with x, y, width and height values
	 * @param {boolean} options.disableCSSAnimation    enable or disable CSS animation
	 * @param {double}  options.saveAboveTolerance     Allowable percentage of mismatches before a diff is saved
	 * @param {boolean} options.ignoreAlpha            compare images and discard alpha
	 * @param {boolean} options.ignoreAntialiasing     compare images and discard anti aliasing
	 * @param {boolean} options.ignoreColors           Even though the images are in colour, the comparison wil compare 2 black/white images
	 * @param {boolean} options.ignoreLess             Compare images and compare with red = 16, green = 16, blue = 16, alpha = 16,
	 *                                                 minBrightness=16, maxBrightness=240
	 * @param {boolean} options.ignoreNothing          Compare images and compare with red = 0, green = 0, blue = 0, alpha = 0,
	 *                                                 minBrightness=0, maxBrightness=255
	 * @param {boolean} options.ignoreTransparentPixel Will ignore all pixels that have some transparency in one of the images
	 * @param {boolean} options.rawMisMatchPercentage  default false. If true the return percentage will be like 0.12345678, default is 0.12
	 *
	 * @return {Promise<string>}
	 */
	async checkElement(element, tag, options = {}) {
		browser.instanceData = browser.instanceData || await getInstanceData();

		return checkElement(
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
	 * Compares an image of a viewport
	 *
	 * @param {string}  tag                           The tag that is used to name the image
	 * @param {object}  options                       The options available for this method
	 * @param {boolean} options.disableCSSAnimation   Disable all css animations, this is optional
	 * @param {boolean} options.hideScrollBars         Hide scrollbars, this is optional
	 * @param {boolean} options.blockOutStatusBar     Blockout the status bar yes or no, it will override the global
	 * @param {boolean} options.blockOutToolBar       Blockout the tool bar yes or no, it will override the global
	 * @param {object}  options.blockOut               Blockout with x, y, width and height values
	 * @param {boolean} options.disableCSSAnimation   enable or disable CSS animation
	 * @param {double}  options.saveAboveTolerance     Allowable percentage of mismatches before a diff is saved
	 * @param {boolean} options.ignoreAlpha           compare images and discard alpha
	 * @param {boolean} options.ignoreAntialiasing     compare images and discard anti aliasing
	 * @param {boolean} options.ignoreColors           Even though the images are in colour, the comparison wil compare 2 black/white images
	 * @param {boolean} options.ignoreLess             compare images and compare with red = 16, green = 16, blue = 16, alpha = 16,
	 *   minBrightness=16, maxBrightness=240
	 * @param {boolean} options.ignoreNothing         compare images and compare with red = 0, green = 0, blue = 0, alpha = 0,
	 *   minBrightness=0, maxBrightness=255
	 * @param {boolean} options.ignoreTransparentPixel Will ignore all pixels that have some transparency in one of the images
	 * @param {boolean} options.rawMisMatchPercentage  default false. If true the return percentage will be like 0.12345678, default is 0.12
	 *
	 * @return {Promise<string>}
	 */
	async checkScreen(tag, options = {}) {
		browser.instanceData = browser.instanceData || await getInstanceData();

		return checkScreen(
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
	 * Compares an image of a viewport
	 *
	 * @param {string}  tag                           The tag that is used to name the image
	 * @param {object}  options                       The options available for this method
	 * @param {boolean} options.disableCSSAnimation   Disable all css animations, this is optional
	 * @param {boolean} options.hideScrollBars         Hide scrollbars, this is optional
	 * @param {boolean} options.fullPageScrollTimeout The scroll timeout, this is optional
	 * @param {boolean} options.blockOutStatusBar     Blockout the status bar yes or no, it will override the global
	 * @param {boolean} options.blockOutToolBar       Blockout the tool bar yes or no, it will override the global
	 * @param {object}  options.blockOut               Blockout with x, y, width and height values
	 * @param {boolean} options.disableCSSAnimation   enable or disable CSS animation
	 * @param {double}  options.saveAboveTolerance     Allowable percentage of mismatches before a diff is saved
	 * @param {boolean} options.ignoreAlpha           compare images and discard alpha
	 * @param {boolean} options.ignoreAntialiasing     compare images and discard anti aliasing
	 * @param {boolean} options.ignoreColors           Even though the images are in colour, the comparison wil compare 2 black/white images
	 * @param {boolean} options.ignoreLess             compare images and compare with red = 16, green = 16, blue = 16, alpha = 16,
	 *   minBrightness=16, maxBrightness=240
	 * @param {boolean} options.ignoreNothing         compare images and compare with red = 0, green = 0, blue = 0, alpha = 0,
	 *   minBrightness=0, maxBrightness=255
	 * @param {boolean} options.ignoreTransparentPixel Will ignore all pixels that have some transparency in one of the images
	 * @param {boolean} options.rawMisMatchPercentage  default false. If true the return percentage will be like 0.12345678, default is 0.12
	 *
	 * @return {Promise<string>}
	 */
	async checkFullPageScreen(tag, options = {}) {
		browser.instanceData = browser.instanceData || await getInstanceData();

		return checkFullPageScreen(
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
