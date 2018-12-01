import beforeScreenshot from '../helpers/beforeScreenshot';
import afterScreenshot from '../helpers/afterScreenshot';
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
	const beforeOptions = {
		instanceData,
		addressBarShadowPadding: options.addressBarShadowPadding,
		disableCSSAnimation: options.disableCSSAnimation,
		noScrollBars: options.hideScrollBars,
		toolBarShadowPadding: options.toolBarShadowPadding,
	};
	const enrichedInstanceData = await beforeScreenshot(methods.executor, beforeOptions, true);

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
		actualFolder: folders.actualFolder,
		base64Image: fullPageBase64Image,
		hideScrollBars: options.hideScrollBars,
		filePath: {
			autoSaveBaseline: options.autoSaveBaseline,
			browserName: enrichedInstanceData.browserName,
			deviceName: enrichedInstanceData.deviceName,
			isMobile: enrichedInstanceData.isMobile,
			savePerInstance: options.savePerInstance,
		},
		fileName: {
			browserName: enrichedInstanceData.browserName,
			deviceName: enrichedInstanceData.deviceName,
			devicePixelRatio: enrichedInstanceData.dimensions.window.devicePixelRatio,
			formatString: options.formatString,
			isMobile: enrichedInstanceData.isMobile,
			isTestInBrowser: enrichedInstanceData.isTestInBrowser,
			logName: enrichedInstanceData.logName,
			name: enrichedInstanceData.name,
			outerHeight: enrichedInstanceData.dimensions.window.outerHeight,
			outerWidth: enrichedInstanceData.dimensions.window.outerWidth,
			screenHeight: enrichedInstanceData.dimensions.window.screenHeight,
			screenWidth: enrichedInstanceData.dimensions.window.screenWidth,
			tag,
		},
	};

	return afterScreenshot(methods.executor, afterOptions);
}
