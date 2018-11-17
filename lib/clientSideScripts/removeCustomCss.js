/**
 * Remove the custom style that has been added
 */
export default function removeCustomCss(id){
  const elem = document.querySelector(`style#${id}`);
  elem.parentNode.removeChild(elem);
}
