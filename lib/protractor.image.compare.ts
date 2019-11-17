import { ElementFinder, ProtractorBrowser } from 'protractor';
import { SaveFullPageMethodOptions } from 'webdriver-image-comparison/build/commands/fullPage.interfaces';
import { SaveScreenMethodOptions } from 'webdriver-image-comparison/build/commands/screen.interfaces';
import { SaveElementMethodOptions } from 'webdriver-image-comparison/build/commands/element.interfaces';
import {
	BaseClass,
	ClassOptions,
	checkElement,
	checkFullPageScreen,
	checkScreen,
	saveElement,
	saveFullPageScreen,
	saveScreen,
} from 'webdriver-image-comparison';

import { getFolders, getInstanceData, optionElementsToWebElements, getWebElements, isAsyncFn } from './utils';


declare let browser: ProtractorBrowser;

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
	async saveElement(element: ElementFinder, tag: string, options: SaveElementMethodOptions = {}) {
		browser.instanceData = browser.instanceData || await getInstanceData();

		options = await optionElementsToWebElements(options);

		return saveElement(
			{
				executor: browser.executeScript,
				screenShot: browser.takeScreenshot
			},
			browser.instanceData,
			getFolders(options, this.folders),
			element.getWebElement() as unknown as HTMLElement,
			tag,
			{
				wic: this.defaultOptions,
				method: options
			},
		);
	}

	/**
	 * Saves an image of a viewport
	 */
	async saveScreen(tag: string, options: SaveScreenMethodOptions = {}) {
		browser.instanceData = browser.instanceData || await getInstanceData();

		options = await optionElementsToWebElements(options);

		return saveScreen(
			{
				executor: browser.executeScript,
				screenShot: browser.takeScreenshot,
			},
			browser.instanceData,
			getFolders(options, this.folders),
			tag,
			{
				wic: this.defaultOptions,
				method: options,
			},
		);
	}

	/**
	 * Saves an image of the complete screen
	 */
	async saveFullPageScreen(tag: string, options: SaveFullPageMethodOptions = {}) {
		browser.instanceData = browser.instanceData || await getInstanceData();

		options = await optionElementsToWebElements(options);

		if (options.hideAfterFirstScroll) {
			options.hideAfterFirstScroll = await getWebElements(options.hideAfterFirstScroll);
		}

		return saveFullPageScreen(
			{
				executor: browser.executeScript,
				screenShot: browser.takeScreenshot
			},
			browser.instanceData,
			getFolders(options, this.folders),
			tag,
			{
				wic: this.defaultOptions,
				method: options,
			},
		);
	}

	/**
	 * Compare an image of an element
	 */
	async checkElement(element: ElementFinder, tag: string, options: SaveElementMethodOptions = {}) {
		browser.instanceData = browser.instanceData || await getInstanceData();

		options = await optionElementsToWebElements(options);

		return checkElement(
			{
				executor: browser.executeScript,
				screenShot: browser.takeScreenshot
			},
			browser.instanceData,
			getFolders(options, this.folders),
			element.getWebElement() as unknown as HTMLElement,
			tag,
			{
				wic: this.defaultOptions,
				method: options,
			},
		);
	}

	/**
	 * Compares an image of a viewport
	 */
	async checkScreen(tag: string, options: SaveScreenMethodOptions = {}) {
		browser.instanceData = browser.instanceData || await getInstanceData();

		options = await optionElementsToWebElements(options);

		return checkScreen(
			{
				executor: browser.executeScript,
				screenShot: browser.takeScreenshot
			},
			browser.instanceData,
			getFolders(options, this.folders),
			tag,
			{
				wic: this.defaultOptions,
				method: options,
			},
		);
	}

	/**
	 * Compares an image of a viewport
	 */
	async checkFullPageScreen(tag: string, options: SaveFullPageMethodOptions = {}) {
		browser.instanceData = browser.instanceData || await getInstanceData();

		options = await optionElementsToWebElements(options);

		return checkFullPageScreen(
			{
				executor: browser.executeScript,
				screenShot: browser.takeScreenshot
			},
			browser.instanceData,
			getFolders(options, this.folders),
			tag,
			{
				wic: this.defaultOptions,
				method: options,
			},
		);
	}
}
