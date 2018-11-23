import { calculateDprData, getScreenshotSize } from '../helpers/utils';
import getElementPositionDesktop from './getElementPositionDesktop';
import getElementPositionAndroid from './getElementPositionAndroid';
import getElementPositionIos from './getElementPositionIos';

/**
 * Determine the element rectangles on the page / screenshot
 *
 * @param   {string}        screenshot    The screenshot
 * @param   {object}        instanceData  Current instance data
 * @param   {function}      executor      The function to execute JS in the browser
 * @param   {ElementFinder} element       The element finder
 *
 * @returns {Promise<{
 *     height: number,
 *     width: number,
 *     x: number,
 *     y: number,
 * }>}
 */
export default async function determineElementRectangles(screenshot, instanceData, executor, element) {
	// Determine screenshot data
	const { devicePixelRatio, innerHeight } = instanceData.dimensions.window;
	const { height } = getScreenshotSize(screenshot, devicePixelRatio);
	let elementPosition;

	// Determine the element position on the screenshot
	if (instanceData.isIos) {
		elementPosition = await getElementPositionIos(executor, element);
	} else if (instanceData.isAndroid) {
		elementPosition = await getElementPositionAndroid(executor, instanceData.isAndroidNativeWebScreenshot, element);
	} else {
		elementPosition = await getElementPositionDesktop(executor, innerHeight, height, element);
	}

	// Determine the rectangles based on the device pixel ratio
	return calculateDprData({
		height: elementPosition.height,
		width: elementPosition.width,
		x: elementPosition.x,
		y: elementPosition.y,
	}, devicePixelRatio);
}
