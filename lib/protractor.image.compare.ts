import {browser, ElementFinder} from 'protractor';
import {
	BaseClass,
	checkElement,
	checkFullPageScreen,
	checkScreen,
	ClassOptions,
	saveElement,
	saveFullPageScreen,
	saveScreen,
} from 'webdriver-image-comparison';
import {SaveFullPageMethodOptions} from 'webdriver-image-comparison/build/commands/fullPage.interfaces';
import {SaveScreenMethodOptions} from 'webdriver-image-comparison/build/commands/screen.interfaces';
import {SaveElementMethodOptions} from 'webdriver-image-comparison/build/commands/element.interfaces';

export default class ProtractorImageComparison extends BaseClass {
	constructor(options: ClassOptions) {
		super(options);
	}

	/**
	 * Saves an image of an element
	 */
	async saveElement(element: ElementFinder, tag: string, saveElementOptions: SaveElementMethodOptions = {}) {
		browser.instanceData = browser.instanceData || await getInstanceData();

		saveElementOptions = await optionElementsToWebElements(saveElementOptions);

		return saveElement(
			{
				executor: browser.executeScript,
				screenShot: browser.takeScreenshot
			},
			browser.instanceData,
			this.folders,
			<HTMLElement><unknown>await element.getWebElement(),
			tag,
			{
				wic: this.defaultOptions,
				method: saveElementOptions
			},
		);
	}

	/**
	 * Saves an image of a viewport
	 */
	async saveScreen(tag: string, saveScreenOptions: SaveScreenMethodOptions = {}) {
		browser.instanceData = browser.instanceData || await getInstanceData();

		saveScreenOptions = await optionElementsToWebElements(saveScreenOptions);

		return saveScreen(
			{
				executor: browser.executeScript,
				screenShot: browser.takeScreenshot,
			},
			browser.instanceData,
			this.folders,
			tag,
			{
				wic: this.defaultOptions,
				method: saveScreenOptions,
			},
		);
	}

	/**
	 * Saves an image of the complete screen
	 */
	async saveFullPageScreen(tag: string, saveFullPageScreenOptions: SaveFullPageMethodOptions = {}) {
		browser.instanceData = browser.instanceData || await getInstanceData();

		saveFullPageScreenOptions = await optionElementsToWebElements(saveFullPageScreenOptions);

		if (saveFullPageScreenOptions.hideAfterFirstScroll) {
			saveFullPageScreenOptions.hideAfterFirstScroll = await getWebElements(saveFullPageScreenOptions.hideAfterFirstScroll);
		}

		return saveFullPageScreen(
			{
				executor: browser.executeScript,
				screenShot: browser.takeScreenshot
			},
			browser.instanceData,
			this.folders,
			tag,
			{
				wic: this.defaultOptions,
				method: saveFullPageScreenOptions,
			},
		);
	}

	/**
	 * Compare an image of an element
	 */
	async checkElement(element: ElementFinder, tag: string, checkElementOptions: SaveElementMethodOptions = {}) {
		browser.instanceData = browser.instanceData || await getInstanceData();

		checkElementOptions = await optionElementsToWebElements(checkElementOptions);

		return checkElement(
			{
				executor: browser.executeScript,
				screenShot: browser.takeScreenshot
			},
			browser.instanceData,
			this.folders,
			<HTMLElement><unknown>await element.getWebElement(),
			tag,
			{
				wic: this.defaultOptions,
				method: checkElementOptions,
			},
		);
	}

	/**
	 * Compares an image of a viewport
	 */
	async checkScreen(tag: string, checkScreenOptions: SaveScreenMethodOptions = {}) {
		browser.instanceData = browser.instanceData || await getInstanceData();

		checkScreenOptions = await optionElementsToWebElements(checkScreenOptions);

		return checkScreen(
			{
				executor: browser.executeScript,
				screenShot: browser.takeScreenshot
			},
			browser.instanceData,
			this.folders,
			tag,
			{
				wic: this.defaultOptions,
				method: checkScreenOptions,
			},
		);
	}

	/**
	 * Compares an image of a viewport
	 */
	async checkFullPageScreen(tag: string, checkFullPageOptions: SaveFullPageMethodOptions = {}) {
		browser.instanceData = browser.instanceData || await getInstanceData();

		checkFullPageOptions = await optionElementsToWebElements(checkFullPageOptions);

		return checkFullPageScreen(
			{
				executor: browser.executeScript,
				screenShot: browser.takeScreenshot
			},
			browser.instanceData,
			this.folders,
			tag,
			{
				wic: this.defaultOptions,
				method: checkFullPageOptions,
			},
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
	};
}

/**
 * Transform all `hideElements`, `removeElements` and `hideAfterFirstScroll`-elements to WebElements
 */
async function optionElementsToWebElements(options: SaveFullPageMethodOptions) {
	if (options.hideElements) {
		options.hideElements = await getWebElements(options.hideElements);
	}

	if (options.removeElements) {
		options.removeElements = await getWebElements(options.removeElements);
	}

	if (options.hideAfterFirstScroll) {
		options.hideAfterFirstScroll = await getWebElements(options.hideAfterFirstScroll);
	}

	return options;
}

/**
 * Get all the web elements
 */
async function getWebElements(elements: HTMLElement[]) {
	for (let i = 0; i < elements.length; i++) {
		elements[i] =
			<HTMLElement><unknown>await (<ElementFinder><unknown>elements[i]).getWebElement();
	}

	return elements;
}