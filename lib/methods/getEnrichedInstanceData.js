import {
	instanceIsMobile,
	checkAndroidChromeDriverScreenshot,
	checkAndroidNativeWebScreenshot,
	platformIsAndroid,
	platformIsIos,
	checkTestInBrowser
} from '../helpers/utils';
import getScreenDimensions from '../clientSideScripts/getScreenDimensions';

/**
 * Enrich the instance data with more data
 *
 * @param {function}  executor      The function to execute JS in the browser
 * @param {object}    options       The options
 * @param {object}    instanceData  Current instance data
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
 *      isIos: boolean,
 *      instanceIsMobile: boolean,
 *      isAndroidNativeWebScreenshot: boolean,
 *      isAndroidChromeDriverScreenshot: boolean,
 *      isTestInBrowser: boolean,
 *      isTestInMobileBrowser: boolean,
 *      toolBarShadowPadding: number,
 *    }
 *  }
 */
export default async function getEnrichedInstanceData(executor, options, instanceData) {
	// Get the current browser data
	const browserData = await executor(getScreenDimensions);

	// Determine some constants
	const isAndroid = platformIsAndroid(instanceData.platformName);
	const isIos = platformIsIos(instanceData.platformName);
	const isMobile = instanceIsMobile(instanceData.platformName);
	const isTestInBrowser = checkTestInBrowser(instanceData.browserName);
	// @todo: make this a method
	const isTestInMobileBrowser = isMobile && isTestInBrowser;
	const isAndroidNativeWebScreenshot = checkAndroidNativeWebScreenshot(instanceData.platformName, instanceData.nativeWebScreenshot);
	const isAndroidChromeDriverScreenshot = checkAndroidChromeDriverScreenshot(instanceData.platformName, instanceData.nativeWebScreenshot);
	// @todo: make this a method
	const addressBarShadowPadding = (isTestInMobileBrowser && ((isAndroidNativeWebScreenshot && isAndroid) || isIos)) ? options.addressBarShadowPadding : 0;
	const toolBarShadowPadding = (isTestInMobileBrowser && isIos) ? options.toolBarShadowPadding : 0;

	// Return the new instance data object
	return {
		...(browserData),
		...(instanceData),
		addressBarShadowPadding,
		isAndroid,
		isIos,
		isMobile,
		isAndroidNativeWebScreenshot,
		isAndroidChromeDriverScreenshot,
		isTestInBrowser,
		isTestInMobileBrowser,
		toolBarShadowPadding,
	};
}
