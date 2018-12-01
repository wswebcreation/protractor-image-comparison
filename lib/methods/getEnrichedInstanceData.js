import {
	checkIsMobile,
	checkAndroidChromeDriverScreenshot,
	checkAndroidNativeWebScreenshot,
	checkIsAndroid,
	checkIsIos,
	checkTestInBrowser,
	checkTestInMobileBrowser,
	getAddressBarShadowPadding,
	getToolBarShadowPadding,
} from '../helpers/utils';
import getScreenDimensions from '../clientSideScripts/getScreenDimensions';

/**
 * Enrich the instance data with more data
 *
 * @param {function} executor                                The function to execute JS in the browser
 * @param {object}   instanceOptions                         The instance options
 * @param {number}   instanceOptions.addressBarShadowPadding The browser name of the instance
 * @param {number}   instanceOptions.toolBarShadowPadding    The browser name of the instance
 * @param {string}   instanceOptions.browserName             The browser name of the instance
 * @param {string}   instanceOptions.deviceName              The device name of the instance
 * @param {string}   instanceOptions.logName                 The log name of the instance
 * @param {string}   instanceOptions.name                    The name of the instance
 * @param {boolean}  instanceOptions.nativeWebScreenshot     If the instance creates native webscreenshots
 * @param {string}   instanceOptions.platformName            The platformname of the instance
 * @param {boolean}  addShadowPadding                        Shadow padding needs to be added on Android (nativeWebScreenshots) and iOS
 *                                                           element/fullpage screenshots
 *
 * @returns {
 *    {
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
 *  }
 */
export async function getEnrichedInstanceData(executor, instanceOptions, addShadowPadding) {
	// Get the current browser data
	const browserData = await executor(getScreenDimensions);
	const { addressBarShadowPadding, toolBarShadowPadding, browserName, nativeWebScreenshot, platformName } = instanceOptions;

	// Determine some constants
	const isAndroid = checkIsAndroid(platformName);
	const isIos = checkIsIos(platformName);
	const isMobile = checkIsMobile(platformName);
	const isTestInBrowser = checkTestInBrowser(browserName);
	const isTestInMobileBrowser = checkTestInMobileBrowser(platformName, browserName);
	const isAndroidNativeWebScreenshot = checkAndroidNativeWebScreenshot(platformName, nativeWebScreenshot);
	const isAndroidChromeDriverScreenshot = checkAndroidChromeDriverScreenshot(platformName, nativeWebScreenshot);
	const addressBarPadding = getAddressBarShadowPadding(platformName, browserName, nativeWebScreenshot, addressBarShadowPadding, addShadowPadding);
	const toolBarPadding = getToolBarShadowPadding(platformName, browserName, toolBarShadowPadding, addShadowPadding);

	// Return the new instance data object
	return {
		...(browserData),
		...(instanceOptions),
		addressBarShadowPadding: addressBarPadding,
		isAndroid,
		isAndroidChromeDriverScreenshot,
		isAndroidNativeWebScreenshot,
		isIos,
		isMobile,
		isTestInBrowser,
		isTestInMobileBrowser,
		toolBarShadowPadding: toolBarPadding,
	};
}
