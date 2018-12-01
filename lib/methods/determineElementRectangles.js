import { calculateDprData, getScreenshotSize } from '../helpers/utils';
import { getElementPositionDesktop } from './getElementPositionDesktop';
import { getElementPositionAndroid } from './getElementPositionAndroid';
import getElementPositionIos from './getElementPositionIos';

/**
 * Determine the element rectangles on the page / screenshot
 *
 * @param {function} executor                             The function to execute JS in the browser
 * @param {string}   screenshot                           The screenshot
 * @param {object}   options                              Current instance data
 * @param {number}   options.devicePixelRatio             The device pixel ration of the screen / device
 * @param {boolean}  options.isAndroidNativeWebScreenshot If this is an Android native screenshot
 * @param {number}   options.innerHeight                  The inner height of a screen
 * @param {boolean}  options.isAndroid                    If this is an Android device
 * @param {boolean}  options.isIos                        If this is an iOS device
 * @param {element}  element                              The element finder
 *
 * @returns {Promise<{
 *     height: number,
 *     width: number,
 *     x: number,
 *     y: number,
 * }>}
 */
export async function determineElementRectangles(executor, screenshot, options, element) {
	// Determine screenshot data
	const { devicePixelRatio, innerHeight, isAndroid, isAndroidNativeWebScreenshot, isIos } = options;
	const { height } = getScreenshotSize(screenshot, devicePixelRatio);
	let elementPosition;

	// Determine the element position on the screenshot
	if (isIos) {
		elementPosition = await getElementPositionIos(executor, element);
	} else if (isAndroid) {
		elementPosition = await getElementPositionAndroid(executor, isAndroidNativeWebScreenshot, element);
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
