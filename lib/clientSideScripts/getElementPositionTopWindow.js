/**
 * Get the position of the element to the top of the window
 *
 * @param {ElementFinder} element The element
 *
 * @returns {
 *  {
 *    height: number,
 *    width: number,
 *    x: number,
 *    y: number
 *  }
 * }
 */
export default function getElementPositionTopWindow(element) {
  const rectangles = element.getBoundingClientRect();

  return {
    height: Math.round(rectangles.height),
    width: Math.round(rectangles.width),
    x: Math.round(rectangles.x),
    y: Math.round(rectangles.y),
  }
}
