import hideScrollBars from '../clientSideScripts/hideScrollBars';
import setCustomCss from '../clientSideScripts/setCustomCss';
import { CUSTOM_CSS_ID } from './constants';
import { instanceIsMobile, platformIsAndroid } from './utils';

/**
 * Methods that need to be executed before a screenshot will be taken
 *
 * @param {function}  executor     The function to execute JS in the browser
 * @param {object}    instanceData ...
 * @param {object}    options      The options object that will hold all the options
 *
 * @returns {Promise<void>}
 */
export default async function beforeScreenshot(executor, instanceData, options) {
	const isMobile = instanceIsMobile(instanceData.platformName);
	const isAndroid = platformIsAndroid(instanceData.platformName);

	// Hide the scrollbars
	await executor(hideScrollBars, options.hideScrollBars);

	// Set some custom css
	await executor(
		setCustomCss,
		{
			// @todo: this needs to be refactored, this needs to be determined in 1 place
			addressBarShadowPadding: isMobile ? options.addressBarShadowPadding : 0,
			// @todo: this needs to be refactored, this needs to be determined in 1 place
			toolBarShadowPadding: isMobile ? options.toolBarShadowPadding : 0,
			disableCSSAnimation: options.disableCSSAnimation,
		},
		CUSTOM_CSS_ID,
	);
}
