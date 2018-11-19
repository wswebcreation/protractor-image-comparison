import hideScrollBars from '../clientSideScripts/hideScrollBars';
import setCustomCss from '../clientSideScripts/setCustomCss';
import { CUSTOM_CSS_ID } from './constants';
import { getAddressBarShadowPadding, getToolBarShadowPadding } from './utils';

/**
 * Methods that need to be executed before a screenshot will be taken
 *
 * @param {function}  executor           The function to execute JS in the browser
 * @param {object}    instanceData       ...
 * @param {object}    options            The options object that will hold all the options
 * @param {boolean}   addShadowPadding   Shadow padding needs to be added on Android (nativeWebScreenshots) and iOS element/fullpage screenshots
 *
 * @returns {Promise<void>}
 */
export default async function beforeScreenshot(executor, instanceData, options, addShadowPadding = false) {
	const browserName = instanceData.browserName;
	const nativeWebScreenshot = instanceData.nativeWebScreenshot;
	const platformName = instanceData.platformName;

	// Hide the scrollbars
	await executor(hideScrollBars, options.hideScrollBars);

	// Set some custom css
	await executor(
		setCustomCss,
		{
			addressBarShadowPadding: getAddressBarShadowPadding(
				platformName,
				browserName,
				nativeWebScreenshot,
				options.addressBarShadowPadding,
				addShadowPadding,
			),
			toolBarShadowPadding: getToolBarShadowPadding(platformName, browserName, options.toolBarShadowPadding, addShadowPadding),
			disableCSSAnimation: options.disableCSSAnimation,
		},
		CUSTOM_CSS_ID,
	);
}
