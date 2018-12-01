import getElementPositionTopWindow from '../clientSideScripts/getElementPositionTopWindow';
import determineAndroidStatusAddressBarHeight from '../clientSideScripts/determineAndroidStatusAddressBarHeight';
import { getElementPositionTopScreenNativeMobile } from '../clientSideScripts/getElementPositionTopScreenNativeMobile';
import { OFFSETS } from '../helpers/constants';

/**
 * Get the element position on a Android device
 *
 * @param {function} executor              The function to execute JS in the browser
 * @param {boolean}  isNativeWebScreenshot If this is an instance that takes a native screenshot
 * @param {element}  element               The element finder
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
		const statusBarAddressBarHeight = await executor(determineAndroidStatusAddressBarHeight, OFFSETS.ANDROID);

		return executor(getElementPositionTopScreenNativeMobile, statusBarAddressBarHeight, element);
	}

	// This is the ChromeDriver screenshot
	return executor(getElementPositionTopWindow, element);
}
