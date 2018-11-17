import { getElementPositionTopScreenIos } from '../clientSideScripts/getElementPositionTopScreenIos';
import { OFFSETS } from '../helpers/constants';

/**
 * Get the element position on iOS Safari
 *
 * @param   {function}      executor          The function to execute JS in the browser
 * @param   {ElementFinder} element           The element finder
 *
 * @returns {{
 * 		height: number,
 *    width: number,
 *    x: number,
 *    y: number
 * }}
 */
export default function getElementPositionIos(executor, element) {
	return executor(getElementPositionTopScreenIos, OFFSETS.IOS, element);
}
