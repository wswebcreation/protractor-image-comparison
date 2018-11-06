import getElementPositionTopWindow from '../cliendSideScripts/getElementPositionTopWindow';
import getElementPositionTopDom from '../cliendSideScripts/getElementPositionTopDom';

/**
 * Get the element position
 *
 * @param   {function}      executor          The function to execute JS in the browser
 * @param   {object}        instanceData      Current instance data
 * @param   {number}        screenshotHeight  The screenshot height
 * @param   {ElementFinder} element           The element finder
 *
 * @returns {Promise<{
 *     x: number,
 *     y: number
 * }>}
 */
export default async function getElementRectangles(executor, instanceData, screenshotHeight, element) {
  if ((screenshotHeight > instanceData.dimensions.window.innerHeight) && !instanceData.isAndroid) {
    console.log('here')
    return executor(getElementPositionTopDom, element);
  }

  return executor(getElementPositionTopWindow, element);
}
