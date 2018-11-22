import getElementPositionTopWindow from '../clientSideScripts/getElementPositionTopWindow';
import determineAndroidStatusAddressBarHeight from '../clientSideScripts/determineAndroidStatusAddressBarHeight';
import getElementPositionTopScreenNativeMobile from '../clientSideScripts/getElementPositionTopScreenNativeMobile';

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
		const statusBarAddressBarHeight = await executor(determineAndroidStatusAddressBarHeight, offsets);

		return executor(getElementPositionTopScreenNativeMobile, statusBarAddressBarHeight, element);
	}

	// This is the chromedriver screenshot
	return executor(getElementPositionTopWindow, element);
}
