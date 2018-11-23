import hideScrollBars from '../clientSideScripts/hideScrollBars';
import setCustomCss from '../clientSideScripts/setCustomCss';
import { CUSTOM_CSS_ID } from './constants';
import { getAddressBarShadowPadding, getToolBarShadowPadding } from './utils';

/**
 * Methods that need to be executed before a screenshot will be taken
 *
 * @param {function}  executor           The function to execute JS in the browser
 * @param {object}    instanceData       Instance data, see getEnrichedInstanceData
 * @param {object}    options            The options object that will hold all the options
 * @param {boolean}   addShadowPadding   Shadow padding needs to be added on Android (nativeWebScreenshots) and iOS element/fullpage
 *
 * @returns {Promise<void>}
 */
export default async function beforeScreenshot(executor, instanceData, options, addShadowPadding = false) {
	const { browserName, nativeWebScreenshot, platformName } = instanceData;
	const { addressBarShadowPadding, disableCSSAnimation, hideScrollBars: noScrollBars, toolBarShadowPadding } = options;
	const addressBarPadding = getAddressBarShadowPadding(platformName, browserName, nativeWebScreenshot, addressBarShadowPadding, addShadowPadding);
	const toolBarPadding = getToolBarShadowPadding(platformName, browserName, toolBarShadowPadding, addShadowPadding);

	// Hide the scrollbars
	await executor(hideScrollBars, noScrollBars);

	// Set some custom css
	await executor(
		setCustomCss,
		{
			addressBarShadowPadding: addressBarPadding,
			toolBarShadowPadding: toolBarPadding,
			disableCSSAnimation: disableCSSAnimation,
		},
		CUSTOM_CSS_ID,
	);
}
