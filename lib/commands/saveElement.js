import takeBase64Screenshot from '../methods/takeBase64Screenshot';
import makeCroppedBase64Image from '../methods/makeCroppedBase64Image';
import beforeScreenshot from '../helpers/beforeScreenshot';
import afterScreenshot from '../helpers/afterScreenshot';
import { getEnrichedInstanceData } from '../methods/getEnrichedInstanceData';
import determineElementRectangles from '../methods/determineElementRectangles';

/**
 * Saves an image of an element
 *
 * @param {object}        methods            The tag that is used
 * @param {function}      methods.executor   The executor function to inject JS into the browser
 * @param {function}      methods.screenShot The screenshot method to take a screenshot
 * @param {object}        instanceData       Instance data, see getInstanceData
 * @param {object}        folders            All the folders that can be used
 * @param {ElementFinder} element            The ElementFinder that is used to get the position
 * @param {string}        tag                The tag that is used
 * @param {object}        options            {defaultOptions} + the options provided by this method
 *
 * @returns {Promise<{
 *   fileName: string,
 *   path: string,
 * }>}
 */
export default async function saveElement(methods, instanceData, folders, element, tag, options) {
	// Before the screenshot methods
	await beforeScreenshot(methods.executor, instanceData, options, true);

	// Get all the needed instance data
	const instanceOptions = {
		addressBarShadowPadding: options.addressBarShadowPadding,
		toolBarShadowPadding: options.toolBarShadowPadding,
		...(instanceData),
	};
	const enrichedInstanceData = await getEnrichedInstanceData(methods.executor, instanceOptions, true);

	/**
	 * THIS IS UNIQUE
	 */

		// Take the screenshot
	const screenshot = await takeBase64Screenshot(methods.screenShot);

	// Determine the rectangles
	const rectangles = await determineElementRectangles(screenshot, enrichedInstanceData, methods.executor, element);

	// Make a cropped base64 image with resizeDimensions
	const croppedBase64Image = await makeCroppedBase64Image(screenshot, rectangles, options.resizeDimensions);

	// The after the screenshot methods
	const afterOptions = {
		autoSaveBaseline: options.autoSaveBaseline,
		actualFolder: folders.actualFolder,
		base64Image: croppedBase64Image,
		browserName: enrichedInstanceData.browserName,
		deviceName: enrichedInstanceData.deviceName,
		devicePixelRatio: enrichedInstanceData.dimensions.window.devicePixelRatio,
		hideScrollBars: options.hideScrollBars,
		isMobile: enrichedInstanceData.isMobile,
		isTestInBrowser: enrichedInstanceData.isTestInBrowser,
		formatString: options.formatString,
		logName: enrichedInstanceData.logName,
		name: enrichedInstanceData.name,
		outerHeight: enrichedInstanceData.dimensions.window.outerHeight,
		outerWidth: enrichedInstanceData.dimensions.window.outerWidth,
		savePerInstance: options.savePerInstance,
		screenHeight: enrichedInstanceData.dimensions.window.screenHeight,
		screenWidth: enrichedInstanceData.dimensions.window.screenWidth,
		tag,
	};

	return afterScreenshot(methods.executor, afterOptions);
}
