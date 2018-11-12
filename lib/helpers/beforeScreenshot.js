import hideScrollBars from '../cliendSideScripts/hideScrollBars';
import setCustomCss from '../cliendSideScripts/setCustomCss';
import { CUSTOM_CSS_ID } from './constants';
import { instanceIsMobile } from './utils';

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

	// Hide the scrollbars
	await executor(hideScrollBars, options.hideScrollBars);

	// Set some custom css
	await executor(
		setCustomCss,
		{
			addressBarShadowPadding: isMobile ? options.addressBarShadowPadding : 0,
			toolBarShadowPadding: isMobile ? options.toolBarShadowPadding : 0,
			disableCSSAnimation: options.disableCSSAnimation,
		},
		CUSTOM_CSS_ID,
	);
}
