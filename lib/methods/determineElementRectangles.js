import { calculateDprRectangles, getScreenshotSize } from '../helpers/utils';
import getElementPositionDesktop from './getElementPositionDesktop';
import { getElementPositionTopScreenIos } from '../clientSideScripts/getElementPositionTopScreenIos';
import { OFFSETS } from '../helpers/constants';

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
	const screenshotHeight = getScreenshotSize(screenshot).height / instanceData.dimensions.window.devicePixelRatio;
	let elementPosition;

	// Determine the element position on the screenshot
	if (instanceData.isIos) {
		elementPosition = await executor(getElementPositionTopScreenIos, OFFSETS.IOS, element);
	}else {
		elementPosition = await getElementPositionDesktop(executor, instanceData.dimensions, screenshotHeight, element);
	}

	// Determine the rectangles
	return calculateDprRectangles({
		height: elementPosition.height,
		width: elementPosition.width,
		x: elementPosition.x,
		y: elementPosition.y,
	}, instanceData.dimensions.window.devicePixelRatio);
}
