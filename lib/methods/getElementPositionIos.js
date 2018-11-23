import getElementPositionTopScreenNativeMobile from '../clientSideScripts/getElementPositionTopScreenNativeMobile';
import determineIosStatusAddressBarHeight from '../clientSideScripts/determineIosStatusAddressBarHeight';
import { OFFSETS } from '../helpers/constants';

/**
 * Get the element position on iOS Safari
 *
 * @param   {function}      executor The function to execute JS in the browser
 * @param   {ElementFinder} element  The element finder
 *
 * @returns {{
 * 		height: number,
 *    width: number,
 *    x: number,
 *    y: number
 * }}
 */
export default async function getElementPositionIos(executor, element) {
	// Determine status and address bar height
	const statusAddressBarHeight = await executor(determineIosStatusAddressBarHeight, OFFSETS.IOS);

	return executor(getElementPositionTopScreenNativeMobile, statusAddressBarHeight, element);
}
