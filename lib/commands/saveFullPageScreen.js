import beforeScreenshot from '../helpers/beforeScreenshot';
import afterScreenshot from '../helpers/afterScreenshot';
import getEnrichedInstanceData from '../methods/getEnrichedInstanceData';
import { getFilePath } from '../helpers/utils';
import saveBase64Image from '../methods/saveBase64Image';
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
 * @returns {Promise<string>}
 */
export default async function saveFullPageScreen(methods, instanceData, folders, tag, options) {
	// Before the screenshot methods
	await beforeScreenshot(methods.executor, instanceData, options, true);

	// Get all the needed instance data
	const enrichedInstanceData = await getEnrichedInstanceData(methods.executor, options, instanceData, true);

	// Fullpage screenshots are taken per scrolled viewport
	const screenshotsData = await getBase64FullPageScreenshotsData(
		methods.screenShot,
		methods.executor,
		options.fullPageScrollTimeout,
		enrichedInstanceData
	);

	// Make a fullpage base64 image
	const fullPageBase64Image = await makeFullPageBase64Image(screenshotsData);

	// Get the filePath
	const filePath = getFilePath(folders.actualFolder, options, tag, enrichedInstanceData);

	// Save the screen
	await saveBase64Image(fullPageBase64Image, filePath);

	// After the screenshot methods
	await afterScreenshot(methods.executor, options);

	return fullPageBase64Image;
}
