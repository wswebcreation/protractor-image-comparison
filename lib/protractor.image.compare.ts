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
import {
	getFolders,
	getInstanceData,
	optionElementsToWebElements,
	getWebElements,
	isAsyncFn,
} from './utils';

export default class ProtractorImageComparison extends BaseClass {

	/**
	 * @description This method create new ProtractorImageComparison instance
	 * and provides to use async functions in library options
	 */
	static async build(options: ClassOptions): Promise<ProtractorImageComparison> {
		const instance = new ProtractorImageComparison(options);
		if (options.baselineFolder && isAsyncFn(options.baselineFolder)) {
			const baselineFolderPath = await options.baselineFolder(options);
			instance.folders.baselineFolder = baselineFolderPath;
		}
		return instance;
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
			getFolders(saveElementOptions, this.folders),
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
			getFolders(saveScreenOptions, this.folders),
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
			getFolders(saveFullPageScreenOptions, this.folders),
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
			getFolders(checkElementOptions, this.folders),
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
			getFolders(checkScreenOptions, this.folders),
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
			getFolders(checkFullPageOptions, this.folders),
			tag,
			{
				wic: this.defaultOptions,
				method: checkFullPageOptions,
			},
		);
	}
}