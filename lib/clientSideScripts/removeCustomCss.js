/**
 * Remove the custom style that has been added
 *
 * @param {string} id The id that is used to remove the style
 */
export default function removeCustomCss(id){
  const elem = document.querySelector(`style#${id}`);
  elem.parentNode.removeChild(elem);
}
