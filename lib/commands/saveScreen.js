import {takeBase64Screenshot} from '../methods/screenshots';
import { makeCroppedBase64Image } from '../methods/images';
import beforeScreenshot from '../helpers/beforeScreenshot';
import afterScreenshot from '../helpers/afterScreenshot';
import { determineScreenRectangles } from '../methods/rectangles';

/**
 * Saves an image of the viewport of the screen
 *
 * @param {object}   methods                          The tag that is used
 * @param {function} methods.executor                 The executor function to inject JS into the browser
 * @param {function} methods.screenShot               The screenshot method to take a screenshot
 * @param {object}   instanceData                     Instance data
 * @param {string}   instanceData.browserName         The browser name of the instance
 * @param {string}   instanceData.deviceName          The device name of the instance
 * @param {string}   instanceData.logName             The log name of the instance
 * @param {string}   instanceData.name                The name of the instance
 * @param {boolean}  instanceData.nativeWebScreenshot If the instance creates native webscreenshots
 * @param {string}   instanceData.platformName        The platformname of the instance
 * @param {object}   folders                          All the folders that can be used
 * @param {string}   folders.actualFolder             The actual folder
 * @param {string}   folders.baselineFolder           The baseline folder
 * @param {string}   folders.diffFolder               The diff folder
 * @param {string}   tag                              The tag that is used
 * @param {object}   options                          {defaultOptions} + the options provided by this method
 *
 * @returns {Promise<{
 *   devicePixelRatio: number,
 *   fileName: string,
 *   path: string,
 * }>}
 */
export default async function saveScreen(methods, instanceData, folders, tag, options) {
	const beforeOptions = {
		instanceData,
		addressBarShadowPadding: options.addressBarShadowPadding,
		disableCSSAnimation: options.disableCSSAnimation,
		noScrollBars: options.hideScrollBars,
		toolBarShadowPadding: options.toolBarShadowPadding,
	};
	const enrichedInstanceData = await beforeScreenshot(methods.executor, beforeOptions);

	// Take the screenshot
	const screenshot = await takeBase64Screenshot(methods.screenShot);

	// Determine the rectangles
	const screenRectangleOptions = {
		devicePixelRatio: enrichedInstanceData.dimensions.window.devicePixelRatio,
		innerHeight: enrichedInstanceData.dimensions.window.innerHeight,
		innerWidth: enrichedInstanceData.dimensions.window.innerWidth,
		isAndroidChromeDriverScreenshot: enrichedInstanceData.isAndroidChromeDriverScreenshot,
		isAndroidNativeWebScreenshot: enrichedInstanceData.isAndroidNativeWebScreenshot,
		isIos: enrichedInstanceData.isIos,
	};
	const rectangles = determineScreenRectangles(screenshot, screenRectangleOptions);

	// Make a cropped base64 image
	const croppedBase64Image = await makeCroppedBase64Image(screenshot, rectangles);

	// The after the screenshot methods
	const afterOptions = {
		actualFolder: folders.actualFolder,
		base64Image: croppedBase64Image,
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
