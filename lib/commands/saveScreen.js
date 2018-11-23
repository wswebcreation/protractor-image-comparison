import takeBase64Screenshot from '../methods/takeBase64Screenshot';
import makeCroppedBase64Image from '../methods/makeCroppedBase64Image';
import beforeScreenshot from '../helpers/beforeScreenshot';
import afterScreenshot from '../helpers/afterScreenshot';
import getEnrichedInstanceData from '../methods/getEnrichedInstanceData';
import determineScreenRectangles from '../methods/determineScreenRectangles';
import { getFilePath } from '../helpers/utils';
import saveBase64Image from '../methods/saveBase64Image';

/**
 * Saves an image of the viewport of the screen
 *
 * @param   {object}        methods            The tag that is used
 * @param   {function}      methods.executor   The executor function to inject JS into the browser
 * @param   {function}      methods.screenShot The screenshot method to take a screenshot
 * @param   {object}        instanceData       Instance data, see getInstanceData
 * @param   {object}        folders            All the folders that can be used
 * @param   {string}        tag                The tag that is used
 * @param   {object}        options            {defaultOptions} + the options provided by this method
 *
 * @returns {Promise<string>}
 */
export default async function saveScreen(methods, instanceData, folders, tag, options) {
	// Before the screenshot methods
	await beforeScreenshot(methods.executor, instanceData, options);

	// Get all the needed instance data
	const enrichedInstanceData = await getEnrichedInstanceData(methods.executor, options, instanceData);

	// Take the screenshot
	const screenshot = await takeBase64Screenshot(methods.screenShot);

	// Determine the rectangles
	const rectangles = determineScreenRectangles(screenshot, enrichedInstanceData);

	// Make a cropped base64 image
	const croppedBase64Image = await makeCroppedBase64Image(screenshot, rectangles);

	// Get the filePath
	const filePath = getFilePath(folders.actualFolder, options, tag, enrichedInstanceData);

	// Save the screen
	await saveBase64Image(croppedBase64Image, filePath);

	// After the screenshot methods
	await afterScreenshot(methods.executor, options);

	return croppedBase64Image;
}
