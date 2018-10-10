import hideScrollBars from '../cliendSideScripts/hideScrollBars';
import setCustomCss from "../cliendSideScripts/setCustomCss";
import { CUSTOM_CSS_ID } from "./constants";

/**
 * Methods that need to be executed before a screenshot will be taken
 *
 * @param {function}  executor  The function to execute JS in the browser
 * @param {object}    options   The options object that will hold all the options
 *
 * @returns {Promise<void>}
 */
export default async function beforeScreenshot(executor, options) {
  // Hide the scrollbars
  await executor(hideScrollBars, options.hideScrollBars);

  // Set some custom css
  await executor(
    setCustomCss,
    {
      addressBarShadowPadding: options.addressBarShadowPadding,
      toolBarShadowPadding: options.toolBarShadowPadding,
      disableCSSAnimation: options.disableCSSAnimation,
    },
    CUSTOM_CSS_ID,
  );
}
