import { ElementFinder, ProtractorBrowser } from 'protractor';
import { Folders } from 'webdriver-image-comparison/build/base.interface';

import { InstanceData, BaseMethodOptions } from './interfaces';


declare let browser: ProtractorBrowser;

/**
 * Get the instance data
 */
export async function getInstanceData(): Promise<InstanceData> {
	const { capabilities = {} } = await browser.getProcessedConfig();
	const options = [
		'browserName',
		'browserVersion',
		'logName',
		'platformName',
		'deviceName'
	];

	const data = options.reduce<{ [key: string]: string }>((result, key) => {
		const value: string = capabilities[key] || '';
		result[key] = value.toLowerCase();
		return result;
	}, {});

	const nativeWebScreenshot = Boolean(capabilities.nativeWebScreenshot);

	return { ...data, nativeWebScreenshot };
}

/**
 * Transform all `hideElements`, `removeElements` and `hideAfterFirstScroll`-elements to WebElements
 */
export async function optionElementsToWebElements(options: BaseMethodOptions) {
	// TODO (vitalie-ly): It's bad solution to mutate variable.
	// The function should be pure and hasn't side effects
	// I think it should be fixed in future 

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
export async function getWebElements(elements: HTMLElement[]) {
	// TODO (vitalie-ly): I think there is wrong type in webdriver-image-comparison
	return (elements as unknown as ElementFinder[]).map(e => e.getWebElement()) as unknown as HTMLElement[];
}

/**
 * Get the folders data
 *
 * If folder options are passed in use those values
 * Otherwise, use the values set during instantiation
 */
export function getFolders(methodOptions: any, folders: Folders): Folders {
	return {
		actualFolder: methodOptions.actualFolder || folders.actualFolder,
		baselineFolder: methodOptions.baselineFolder || folders.baselineFolder,
		diffFolder: methodOptions.diffFolder || folders.diffFolder
	};
}

/**
 * @description Detect if a function is asynchronous
 */
export function isAsyncFn(fn: () => void): boolean {
	return fn.constructor.name === 'AsyncFunction';
}
