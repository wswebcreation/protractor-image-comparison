import beforeScreenshot from '../helpers/beforeScreenshot';
import afterScreenshot from '../helpers/afterScreenshot';
import getEnrichedInstanceData from '../methods/getEnrichedInstanceData';
import { getFilePath } from '../helpers/utils';
import saveBase64Image from '../methods/saveBase64Image';
import { getBase64FullPageScreenshotsData } from '../methods/getBase64FullPageScreenshotsData';
import { makeFullPageBase64Image } from '../methods/makeFullPageBase64Image';

/**
 * Saves an image of the full page
 *
 * @param  {object}  methods                        The tag that is used
 * @param  {object}  instanceData                    ..
 * @param  {object}  folders                        ..
 * @param  {string}  tag                            The tag that is used
 * @param  {object}  options                        ..
 * @param  {number}  options.fullPageScrollTimeout  The time that needs to be waited when scrolling to a point and save the screenshot
 *
 *
 * @returns {Promise}
 */
export default async function saveFullPageScreen(methods, instanceData, folders, tag, options) {
	// Before the screenshot methods
	await beforeScreenshot(methods.executor, instanceData, options);

	// Get all the needed instance data
	const enrichedInstanceData = await getEnrichedInstanceData(methods.executor, options, instanceData);

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
