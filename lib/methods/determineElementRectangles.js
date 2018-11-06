import {calculateDprRectangles} from '../helpers/utils';
import getElementRectangles from './getElementRectangles';

/**
 * Determine the element rectangles on the page / screenshot
 *
 * @param   {string}        screenshot    The screenshot
 * @param   {object}        instanceData  Current instance data
 * @param   {function}      executor      The function to execute JS in the browser
 * @param   {ElementFinder} element       The element finder
 *
 * @returns {Promise<{
 *     height: number,
 *     width: number,
 *     x: number,
 *     y: number,
 * }>}
 */
export default async function determineElementRectangles(screenshot, instanceData, executor, element) {
  // Determine screenshot data
  const screenshotHeight = (new Buffer(screenshot, 'base64').readUInt32BE(20) / instanceData.dimensions.window.devicePixelRatio); // width = 16
  // Determine element position
  const elementPosition = await getElementRectangles(executor, instanceData, screenshotHeight, element);

  // Determine the rectangles
  return calculateDprRectangles({
    height: elementPosition.height,
    width: elementPosition.width,
    x: elementPosition.x,
    y: elementPosition.y,
  }, instanceData.dimensions.window.devicePixelRatio);
}
