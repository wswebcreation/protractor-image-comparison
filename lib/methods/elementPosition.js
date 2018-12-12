import getElementPositionTopWindow from '../clientSideScripts/getElementPositionTopWindow';
import getElementPositionTopDom from '../clientSideScripts/getElementPositionTopDom';
import getAndroidStatusAddressToolBarHeight from '../clientSideScripts/getAndroidStatusAddressToolBarHeight';
import { getIosStatusAddressToolBarHeight } from '../clientSideScripts/getIosStatusAddressToolBarHeight';
import { getElementPositionTopScreenNativeMobile } from '../clientSideScripts/getElementPositionTopScreenNativeMobile';
import { OFFSETS } from '../helpers/constants';

/**
 * Get the element position on a Android device
 *
 * @param {function} executor              The function to execute JS in the browser
 * @param {boolean}  isNativeWebScreenshot If this is an instance that takes a native screenshot
 * @param {element}  element               The element
 *
 * @returns {Promise<{
 * 		height: number,
 *    width: number,
 *    x: number,
 *    y: number
 * }>}
 */
export async function getElementPositionAndroid(executor, isNativeWebScreenshot, element) {
	// This is the native webscreenshot
	if (isNativeWebScreenshot) {
		const { height } = (await executor(getAndroidStatusAddressToolBarHeight, OFFSETS.ANDROID)).statusAddressBar;

		return executor(getElementPositionTopScreenNativeMobile, height, element);
	}

	// This is the ChromeDriver screenshot
	return executor(getElementPositionTopWindow, element);
}

/**
 * Get the element position on a desktop browser
 *
 * @param {function} executor         The function to execute JS in the browser
 * @param {number}   innerHeight      The inner height of the screen
 * @param {number}   screenshotHeight The screenshot height
 * @param {element}  element          The element
 *
 * @returns {Promise<{
 * 		height: number,
 *    width: number,
 *    x: number,
 *    y: number
 * }>}
 */
export async function getElementPositionDesktop(executor, innerHeight, screenshotHeight, element) {
	if (screenshotHeight > innerHeight) {
		return executor(getElementPositionTopDom, element);
	}

	return executor(getElementPositionTopWindow, element);
}

/**
 * Get the element position on iOS Safari
 *
 * @param {function} executor The function to execute JS in the browser
 * @param {element}  element  The element
 *
 * @returns {{
 * 		height: number,
 *    width: number,
 *    x: number,
 *    y: number
 * }}
 */
export async function getElementPositionIos(executor, element) {
	// Determine status and address bar height
	const { height } = (await executor(getIosStatusAddressToolBarHeight, OFFSETS.IOS)).statusAddressBar;

	return executor(getElementPositionTopScreenNativeMobile, height, element);
}
