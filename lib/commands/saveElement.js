import { join } from 'path';
import takeBase64Screenshot from '../methods/takeBase64Screenshot';
import makeCroppedBase64Image from '../methods/makeCroppedBase64Image';
import beforeScreenshot from '../helpers/beforeScreenshot';
import afterScreenshot from '../helpers/afterScreenshot';
import { getEnrichedInstanceData } from '../methods/getEnrichedInstanceData';
import { formatFileNameNew, getAndCreatePath } from '../helpers/utils';
import saveBase64Image from '../methods/saveBase64Image';
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
 * @returns {Promise<string>}
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

	// Take the screenshot
	const screenshot = await takeBase64Screenshot(methods.screenShot);

	// Determine the rectangles
	const rectangles = await determineElementRectangles(screenshot, enrichedInstanceData, methods.executor, element);

	// Make a cropped base64 image with resizeDimensions
	const croppedBase64Image = await makeCroppedBase64Image(screenshot, rectangles, options.resizeDimensions);

	// Get the path
	const getFilePathOptions = {
		autoSaveBaseline: options.autoSaveBaseline,
		browserName: enrichedInstanceData.browserName,
		deviceName: enrichedInstanceData.deviceName,
		isMobile: enrichedInstanceData.isMobile,
		savePerInstance: options.savePerInstance,
	};
	const path = getAndCreatePath(folders.actualFolder, getFilePathOptions);

	// Get the filePath
	const fileNameOptions = {
		browserName: enrichedInstanceData.browserName,
		deviceName: enrichedInstanceData.deviceName,
		devicePixelRatio: enrichedInstanceData.dimensions.window.devicePixelRatio,
		isMobile: enrichedInstanceData.isMobile,
		isTestInBrowser: enrichedInstanceData.isTestInBrowser,
		logName: enrichedInstanceData.logName,
		name: enrichedInstanceData.name,
		outerHeight: enrichedInstanceData.dimensions.window.outerHeight,
		outerWidth: enrichedInstanceData.dimensions.window.outerWidth,
		screenHeight: enrichedInstanceData.dimensions.window.screenHeight,
		screenWidth: enrichedInstanceData.dimensions.window.screenWidth,
		tag,
	};
	const fileName = formatFileNameNew(options.formatString, fileNameOptions);

	// Save the element
	await saveBase64Image(croppedBase64Image, join(path, fileName));

	// After the screenshot methods
	await afterScreenshot(methods.executor, options);

	// Return the needed data
	return {
		path,
		fileName
	};
}
