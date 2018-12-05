import {takeBase64Screenshot} from '../methods/screenshots';
import { makeCroppedBase64Image } from '../methods/images';
import beforeScreenshot from '../helpers/beforeScreenshot';
import afterScreenshot from '../helpers/afterScreenshot';
import { determineElementRectangles } from '../methods/rectangles';

/**
 * Saves an image of an element
 *
 * @param {object}        methods                          The tag that is used
 * @param {function}      methods.executor                 The executor function to inject JS into the browser
 * @param {function}      methods.screenShot               The screenshot method to take a screenshot
 * @param {object}        instanceData                     Instance data
 * @param {string}        instanceData.browserName         The browser name of the instance
 * @param {string}        instanceData.deviceName          The device name of the instance
 * @param {string}        instanceData.logName             The log name of the instance
 * @param {string}        instanceData.name                The name of the instance
 * @param {boolean}       instanceData.nativeWebScreenshot If the instance creates native webscreenshots
 * @param {string}        instanceData.platformName        The platformname of the instance
 * @param {object}        folders                          All the folders that can be used
 * @param {string}        folders.actualFolder             The actual folder
 * @param {string}        folders.baselineFolder           The baseline folder
 * @param {string}        folders.diffFolder               The diff folder
 * @param {ElementFinder} element                          The ElementFinder that is used to get the position
 * @param {string}        tag                              The tag that is used
 * @param {object}        options                          The options
 * @param {number}        options.addressBarShadowPadding  The padding that needs to be added to the address bar on iOS and Android
 * @param {boolean}       options.disableCSSAnimation      Disable all css animations
 * @param {boolean}       options.formatString             The format of the image name
 * @param {boolean}       options.hideScrollBars           Hide all scrollbars
 * @param {object|number} options.resizeDimensions         The resizeDimensions, for backwards compatibility this will be an object or a
 *                                                         number
 * @param {number}        options.toolBarShadowPadding     The padding that needs to be added to the tool bar on iOS and Android
 *
 * @returns {Promise<{
 *   fileName: string,
 *   path: string,
 * }>}
 */
export default async function saveElement(methods, instanceData, folders, element, tag, options) {
	const {
		addressBarShadowPadding,
		disableCSSAnimation,
		formatString,
		hideScrollBars,
		resizeDimensions,
		savePerInstance,
		toolBarShadowPadding
	} = options;
	const beforeOptions = {
		instanceData,
		addressBarShadowPadding: addressBarShadowPadding,
		disableCSSAnimation: disableCSSAnimation,
		noScrollBars: hideScrollBars,
		toolBarShadowPadding: toolBarShadowPadding,
	};
	const enrichedInstanceData = await beforeScreenshot(methods.executor, beforeOptions, true);

	// Take the screenshot
	const screenshot = await takeBase64Screenshot(methods.screenShot);

	// Determine the rectangles
	const elementRectangleOptions = {
		devicePixelRatio: enrichedInstanceData.dimensions.window.devicePixelRatio,
		innerHeight: enrichedInstanceData.dimensions.window.innerHeight,
		isAndroidNativeWebScreenshot: enrichedInstanceData.isAndroidNativeWebScreenshot,
		isAndroid: enrichedInstanceData.isAndroid,
		isIos: enrichedInstanceData.isIos,
	};
	const rectangles = await determineElementRectangles(methods.executor, screenshot, elementRectangleOptions, element);

	// Make a cropped base64 image with resizeDimensions
	const croppedBase64Image = await makeCroppedBase64Image(screenshot, rectangles, resizeDimensions);

	// The after the screenshot methods
	const afterOptions = {
		actualFolder: folders.actualFolder,
		base64Image: croppedBase64Image,
		hideScrollBars: hideScrollBars,
		filePath: {
			browserName: enrichedInstanceData.browserName,
			deviceName: enrichedInstanceData.deviceName,
			isMobile: enrichedInstanceData.isMobile,
			savePerInstance: savePerInstance,
		},
		fileName: {
			browserName: enrichedInstanceData.browserName,
			deviceName: enrichedInstanceData.deviceName,
			devicePixelRatio: enrichedInstanceData.dimensions.window.devicePixelRatio,
			formatString: formatString,
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
