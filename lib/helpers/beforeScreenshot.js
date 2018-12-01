import hideScrollBars from '../clientSideScripts/hideScrollBars';
import setCustomCss from '../clientSideScripts/setCustomCss';
import { CUSTOM_CSS_ID } from './constants';
import { getAddressBarShadowPadding, getToolBarShadowPadding } from './utils';
import { getEnrichedInstanceData } from '../methods/getEnrichedInstanceData';

/**
 * Methods that need to be executed before a screenshot will be taken
 *
 * @param {function} executor                                 The function to execute JS in the browser
 * @param {object}   options                                  The options data
 * @param {object}   options.instanceData                     The instance data
 * @param {string}   options.instanceData.browserName         The browser name of the instance
 * @param {string}   options.instanceData.deviceName          The device name of the instance
 * @param {string}   options.instanceData.logName             The log name of the instance
 * @param {string}   options.instanceData.name                The name of the instance
 * @param {boolean}  options.instanceData.nativeWebScreenshot If the instance creates native webscreenshots
 * @param {string}   options.instanceData.platformName        The platformname of the instance
 * @param {number}   options.addressBarShadowPadding          The padding that needs to be added to the address bar on iOS and Android
 * @param {boolean}  options.disableCSSAnimation              Disable all css animations
 * @param {boolean}  options.noScrollBars                     Hide all scrollbars
 * @param {number}   options.toolBarShadowPadding             The padding that needs to be added to the tool bar on iOS and Android
 * @param {boolean}  addShadowPadding                         Shadow padding needs to be added on Android (nativeWebScreenshots) and iOS
 *                                                            element/fullpage
 *
 * @returns {Promise<{
 *      dimensions: {
 *        body: {
 *          scrollHeight: number,
 *          offsetHeight: number
 *        },
 *        html: {
 *          clientWidth: number,
 *          scrollWidth: number,
 *          clientHeight: number,
 *          scrollHeight: number,
 *          offsetHeight: number
 *        },
 *        window: {
 *          innerWidth: number,
 *          innerHeight: number,
 *          outerWidth: number,
 *          outerHeight: number,
 *          devicePixelRatio: number,
 *          screenWidth: number,
 *          screenHeight: number
 *        }
 *      },
 *      browserName: string,
 *      deviceName: string,
 *      logName: string,
 *      name: string,
 *      nativeWebScreenshot: boolean,
 *      platformName: string,
 *      addressBarShadowPadding: number,
 *      isAndroid: boolean,
 *      isAndroidChromeDriverScreenshot: boolean,
 *      isAndroidNativeWebScreenshot: boolean,
 *      isIos: boolean,
 *      isMobile: boolean,
 *      isTestInBrowser: boolean,
 *      isTestInMobileBrowser: boolean,
 *      toolBarShadowPadding: number,
 *    }
 *  >}
 */
export default async function beforeScreenshot(executor, options, addShadowPadding = false) {
	const { browserName, nativeWebScreenshot, platformName } = options.instanceData;
	const { addressBarShadowPadding, disableCSSAnimation, noScrollBars, toolBarShadowPadding } = options;
	const addressBarPadding = getAddressBarShadowPadding(platformName, browserName, nativeWebScreenshot, addressBarShadowPadding, addShadowPadding);
	const toolBarPadding = getToolBarShadowPadding(platformName, browserName, toolBarShadowPadding, addShadowPadding);

	// Hide the scrollbars
	await executor(hideScrollBars, noScrollBars);

	// Set some custom css
	await executor(setCustomCss, { addressBarPadding, disableCSSAnimation, id: CUSTOM_CSS_ID, toolBarPadding });

	// Get all the needed instance data
	const instanceOptions = {
		addressBarShadowPadding: options.addressBarShadowPadding,
		toolBarShadowPadding: options.toolBarShadowPadding,
		...(options.instanceData),
	};

	return getEnrichedInstanceData(executor, instanceOptions, addShadowPadding);
}
