/**
 * Set some default css
 *
 * @param {object}  cssOptions The CSS options
 * @param {string}  id         The id that can identify the css style
 */
export default function setCustomCss(cssOptions, id) {
	const disableTransformationsTransitionsAnimations = `
* {
    -o-transition-property: none !important;
    -moz-transition-property: none !important;
    -ms-transition-property: none !important;
    -webkit-transition-property: none !important;
    transition-property: none !important;
    -o-transform: none !important;
    -moz-transform: none !important;
    -ms-transform: none !important;
    -webkit-transform: none !important;
    transform: none !important;
    -webkit-animation: none !important;
    -moz-animation: none !important;
    -o-animation: none !important;
    -ms-animation: none !important;
    animation: none !important;
}`;
	const { addressBarShadowPadding, disableCSSAnimation, toolBarShadowPadding } = cssOptions;
	const bodyTopPadding = addressBarShadowPadding === 0 ? '' : `body{padding-top:${addressBarShadowPadding}px !important}`;
	const bodyBottomPadding = toolBarShadowPadding === 0 ? '' : `body{padding-bottom:${toolBarShadowPadding}px !important}`;
	const css = (disableCSSAnimation ? disableTransformationsTransitionsAnimations : '') + bodyTopPadding + bodyBottomPadding;
	const head = document.head || document.getElementsByTagName('head')[ 0 ];
	const style = document.createElement('style');

	style.type = 'text/css';
	style.id = id;
	style.appendChild(document.createTextNode(css));
	head.appendChild(style);
}
