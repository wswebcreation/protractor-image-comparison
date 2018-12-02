import getFullPageScreenshotsDataDesktop from './getFullPageScreenshotsDataDesktop';
import getFullPageScreenshotsDataNativeMobile from './getFullPageScreenshotsDataNativeMobile';
import determineAndroidStatusAddressBarHeight from '../clientSideScripts/determineAndroidStatusAddressBarHeight';
import { OFFSETS } from '../helpers/constants';
import { determineIosStatusAddressBarHeight } from '../clientSideScripts/determineIosStatusAddressBarHeight';
import getFullPageScreenshotsDataAndroidChromeDriver from './getFullPageScreenshotsDataAndroidChromeDriver';

/**
 * Take a full page screenshots for desktop / iOS / Android
 *
 * @param {function} takeScreenshot        The screenshot method
 * @param {function} executor              The command to execute js in the browser
 * @param {number}   fullPageScrollTimeout The timeout to wait after a scroll
 * @param {object}   instanceData          The instance data
 *
 * @returns {Promise<{
 * 		fullPageHeight: number,
 * 		fullPageWidth: number,
 * 		data: [{
 * 		 	 canvasWidth: number,
 * 		 	 canvasYPosition: number,
 * 		 	 imageHeight: number,
 * 		 	 imageWidth: number,
 * 		 	 imageYPosition: number,
 * 		 	 screenshot: string,
 * 		}]
 * }>}
 */
export default async function getBase64FullPageScreenshotsData(takeScreenshot, executor, fullPageScrollTimeout, instanceData) {
	if (instanceData.isAndroid && instanceData.isAndroidNativeWebScreenshot) {
		// Create a fullpage screenshot for Android when native screenshot (so including status, address and toolbar) is created
		const statusAddressBarHeight = await executor(determineAndroidStatusAddressBarHeight, OFFSETS.ANDROID);

		return getFullPageScreenshotsDataNativeMobile(takeScreenshot, executor, statusAddressBarHeight, fullPageScrollTimeout, instanceData);
	} else if (instanceData.isAndroid && instanceData.isAndroidChromeDriverScreenshot) {
		// Create a fullpage screenshot for Android when the ChromeDriver provides the screenshots
		return getFullPageScreenshotsDataAndroidChromeDriver(takeScreenshot, executor, fullPageScrollTimeout, instanceData);
	} else if (instanceData.isIos) {
		// Create a fullpage screenshot for iOS. iOS screenshots will hold the status, address and toolbar so they need to be removed
		const statusAddressBarHeight = await executor(determineIosStatusAddressBarHeight, OFFSETS.IOS);

		return getFullPageScreenshotsDataNativeMobile(takeScreenshot, executor, statusAddressBarHeight, fullPageScrollTimeout, instanceData);
	}

	// Create a fullpage screenshot for all desktops
	return getFullPageScreenshotsDataDesktop(takeScreenshot, executor, fullPageScrollTimeout, instanceData);
}