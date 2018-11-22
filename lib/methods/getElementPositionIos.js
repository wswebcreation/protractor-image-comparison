import getElementPositionTopScreenNativeMobile from '../clientSideScripts/getElementPositionTopScreenNativeMobile';
import determineIosStatusAddressBarHeight from '../clientSideScripts/determineIosStatusAddressBarHeight';

/**
 * Get the element position on iOS Safari
 *
 * @param   {function}      executor The function to execute JS in the browser
 * @param   {object}        offsets  The iOS offsets
 * @param   {ElementFinder} element  The element finder
 *
 * @returns {{
 * 		height: number,
 *    width: number,
 *    x: number,
 *    y: number
 * }}
 */
export default async function getElementPositionIos(executor, offsets, element) {
	// Determine status and address bar height
	const statusBarAddressBarHeight = await executor(determineIosStatusAddressBarHeight, offsets);

	return executor(getElementPositionTopScreenNativeMobile, statusBarAddressBarHeight, element);
}
