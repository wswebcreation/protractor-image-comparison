import getElementPositionTopWindow from '../cliendSideScripts/getElementPositionTopWindow';
import getElementPositionTopDom from '../cliendSideScripts/getElementPositionTopDom';

/**
 * Get the element position on a desktop browser
 *
 * @param   {function}      executor          The function to execute JS in the browser
 * @param   {object}        dimensions      	Current instance dimensions data
 * @param   {number}        screenshotHeight  The screenshot height
 * @param   {ElementFinder} element           The element finder
 *
 * @returns {Promise<{
 * 		height: number,
 *    width: number,
 *    x: number,
 *    y: number
 * }>}
 */
export default async function getElementPositionDesktop(executor, dimensions, screenshotHeight, element) {
	if (screenshotHeight > dimensions.window.innerHeight) {
		return executor(getElementPositionTopDom, element);
	}

	return executor(getElementPositionTopWindow, element);
}
