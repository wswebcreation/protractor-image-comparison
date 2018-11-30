import beforeScreenshot from '../helpers/beforeScreenshot';
import afterScreenshot from '../helpers/afterScreenshot';
import { getEnrichedInstanceData } from '../methods/getEnrichedInstanceData';
import getBase64FullPageScreenshotsData from '../methods/getBase64FullPageScreenshotsData';
import makeFullPageBase64Image from '../methods/makeFullPageBase64Image';

/**
 * Saves an image of the full page
 *
 * @param {object}   methods            The tag that is used
 * @param {function} methods.executor   The executor function to inject JS into the browser
 * @param {function} methods.screenShot The screenshot method to take a screenshot
 * @param {object}   instanceData       Instance data, see getInstanceData
 * @param {object}   folders            All the folders that can be used
 * @param {string}   tag                The tag that is used
 * @param {object}   options            {defaultOptions} + the options provided by this method
 *
 * @returns {Promise<{
 *   fileName: string,
 *   path: string,
 * }>}
 */
export default async function saveFullPageScreen(methods, instanceData, folders, tag, options) {
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

	// Fullpage screenshots are taken per scrolled viewport
	const screenshotsData = await getBase64FullPageScreenshotsData(
		methods.screenShot,
		methods.executor,
		options.fullPageScrollTimeout,
		enrichedInstanceData,
	);

	// Make a fullpage base64 image
	const fullPageBase64Image = await makeFullPageBase64Image(screenshotsData);

	// The after the screenshot methods
	const afterOptions = {
		autoSaveBaseline: options.autoSaveBaseline,
		actualFolder: folders.actualFolder,
		base64Image: fullPageBase64Image,
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
