import getElementPositionTopWindow from '../clientSideScripts/getElementPositionTopWindow';
import { getElementPositionTopScreenAndroid } from '../clientSideScripts/getElementPositionTopScreenAndroid';

/**
 * Get the element position on a Android device
 *
 * @param   {function}      executor              The function to execute JS in the browser
 * @param   {boolean}       isNativeWebScreenshot If this is an instance that takes a native screenshot
 * @param   {object}        offsets               The screenshot height
 * @param   {ElementFinder} element               The element finder
 *
 * @returns {Promise<{
 * 		height: number,
 *    width: number,
 *    x: number,
 *    y: number
 * }>}
 */
export default async function getElementPositionAndroid(executor, isNativeWebScreenshot, offsets, element) {
	// This is the native webscreenshot
	if (isNativeWebScreenshot) {
		return executor(getElementPositionTopScreenAndroid, offsets, element);
	}

	// This is the chromedriver screenshot
	return executor(getElementPositionTopWindow, element);
}
