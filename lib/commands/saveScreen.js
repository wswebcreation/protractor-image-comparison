import takeBase64Screenshot from '../methods/takeBase64Screenshot';
import makeCroppedBase64Image from '../methods/makeCroppedBase64Image';
import beforeScreenshot from '../helpers/beforeScreenshot';
import afterScreenshot from '../helpers/afterScreenshot';
import { getEnrichedInstanceData } from '../methods/getEnrichedInstanceData';
import determineScreenRectangles from '../methods/determineScreenRectangles';

/**
 * Saves an image of the viewport of the screen
 *
 * @param {object}   methods                          The tag that is used
 * @param {function} methods.executor                 The executor function to inject JS into the browser
 * @param {function} methods.screenShot               The screenshot method to take a screenshot
 * @param {object}   instanceData                     Instance data
 * @param {object}   instanceData.browserName         The browser name of the instance
 * @param {object}   instanceData.deviceName          The device name of the instance
 * @param {object}   instanceData.logName             The log name of the instance
 * @param {object}   instanceData.name                The name of the instance
 * @param {object}   instanceData.nativeWebScreenshot If the instance creates native webscreenshots
 * @param {object}   instanceData.platformName        The platformname of the instance
 * @param {object}   folders                          All the folders that can be used
 * @param {string}   folders.actualFolder             The actual folder
 * @param {string}   folders.baselineFolder           The baseline folder
 * @param {string}   folders.diffFolder               The diff folder
 * @param {string}   tag                              The tag that is used
 * @param {object}   options                          {defaultOptions} + the options provided by this method
 *
 * @returns {Promise<{
 *   fileName: string,
 *   path: string,
 * }>}
 */
export default async function saveScreen(methods, instanceData, folders, tag, options) {
	// Before the screenshot methods
	await beforeScreenshot(methods.executor, instanceData, options);

	// Get all the needed instance data
	const instanceOptions = {
		addressBarShadowPadding: options.addressBarShadowPadding,
		toolBarShadowPadding: options.toolBarShadowPadding,
		...(instanceData),
	};
	const enrichedInstanceData = await getEnrichedInstanceData(methods.executor, instanceOptions);

	/**
	 * THIS IS UNIQUE
	 */
		// Take the screenshot
	const screenshot = await takeBase64Screenshot(methods.screenShot);

	// Determine the rectangles
	const rectangles = determineScreenRectangles(screenshot, enrichedInstanceData);

	// Make a cropped base64 image
	const croppedBase64Image = await makeCroppedBase64Image(screenshot, rectangles);

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
