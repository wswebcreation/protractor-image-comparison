import {browser, ElementFinder} from "protractor";
import {SaveFullPageMethodOptions} from "webdriver-image-comparison/build/commands/fullPage.interfaces";


/**
 * Get the instance data
 */
export async function getInstanceData() {
	const instanceConfig = (await browser.getProcessedConfig()).capabilities;

	// Substract the needed data from the running instance
	const browserName = (instanceConfig.browserName || '').toLowerCase();
	const browserVersion = instanceConfig.browserVersion || '';
	const logName = instanceConfig.logName || '';
	const name = instanceConfig.name || '';

	// For mobile
	const platformName = (instanceConfig.platformName || '').toLowerCase();
	const deviceName = (instanceConfig.deviceName || '').toLowerCase();
	const nativeWebScreenshot = !!instanceConfig.nativeWebScreenshot;

	return {
		browserName,
		browserVersion,
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
export async function optionElementsToWebElements(options: SaveFullPageMethodOptions) {
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
	for (let i = 0; i < elements.length; i++) {
		elements[i] =
			<HTMLElement><unknown>await (<ElementFinder><unknown>elements[i]).getWebElement();
	}

	return elements;
}

/**
 * Get the folders data
 *
 * If folder options are passed in use those values
 * Otherwise, use the values set during instantiation
 */
export function getFolders(
	methodOptions: any,
	folders?: {
		actualFolder?: string,
		baselineFolder?: string,
		diffFolder?: string,
	}):
	{
		actualFolder: string,
		baselineFolder: string,
		diffFolder: string
	} {
	return {
		actualFolder: (methodOptions.actualFolder ? methodOptions.actualFolder : folders.actualFolder),
		baselineFolder: (methodOptions.baselineFolder ? methodOptions.baselineFolder : folders.baselineFolder),
		diffFolder: (methodOptions.diffFolder ? methodOptions.diffFolder : folders.diffFolder)
	};
}

export function isAsyncFn(fn: () => void) {
	return fn.constructor.name === 'AsyncFunction';
}
