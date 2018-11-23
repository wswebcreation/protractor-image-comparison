import getElementPositionTopWindow from '../clientSideScripts/getElementPositionTopWindow';
import getElementPositionTopDom from '../clientSideScripts/getElementPositionTopDom';

/**
 * Get the element position on a desktop browser
 *
 * @param   {function}      executor          The function to execute JS in the browser
 * @param   {number}        innerHeight      	The inner height of the screen
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
export default async function getElementPositionDesktop(executor, innerHeight, screenshotHeight, element) {
	if (screenshotHeight > innerHeight) {
		return executor(getElementPositionTopDom, element);
	}

	return executor(getElementPositionTopWindow, element);
}
