/**
 * Get the position of the element to the top of the DOM
 *
 * @param {element} element The element
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
export default function getElementPositionTopDom(element) {
  return {
    height: element.offsetHeight,
    width: element.offsetWidth,
    x: element.offsetLeft,
    y: element.offsetTop,
  }
}
