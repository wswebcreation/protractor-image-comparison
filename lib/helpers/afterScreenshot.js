import hideScrollBars from '../clientSideScripts/hideScrollBars';
import removeCustomCss from '../clientSideScripts/removeCustomCss';
import { CUSTOM_CSS_ID } from './constants';

/**
 * Methods that need to be executed after a screenshot has been taken
 * to set all back to the original state
 *
 * @param {function} executor The function to execute JS in the browser
 * @param {object}   options  The options object that will hold all the options
 *
 * @returns {Promise<void>}
 */
export default async function afterScreenshot(executor, options) {
	// Show the scrollbars
	await executor(hideScrollBars, !options.hideScrollBars);

	// Remove the custom set css
	await executor(removeCustomCss, CUSTOM_CSS_ID);
}
