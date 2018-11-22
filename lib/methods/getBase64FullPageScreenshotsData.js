import { getFullPageScreenshotsDataDesktop } from './getFullPageScreenshotsDataDesktop';
import { getFullPageScreenshotsDataIos } from './getFullPageScreenshotsDataIos';

/**
 * Take a full page screenshots for desktop / iOS / Android
 *
 * @param  {function}  takeScreenshot         The screenshot method
 * @param  {function}  executor               The command to execute js in the browser
 * @param  {number}    fullPageScrollTimeout  The timeout to wait after a scroll
 * @param  {object}    instanceData           The instance data
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
export async function getBase64FullPageScreenshotsData(takeScreenshot, executor, fullPageScrollTimeout, instanceData) {
	if (instanceData.isAndroid) {
		return getFullPageScreenshotsDataIos(takeScreenshot, executor, fullPageScrollTimeout, instanceData);
	} else if (instanceData.isIos) {
		return getFullPageScreenshotsDataIos(takeScreenshot, executor, fullPageScrollTimeout, instanceData);
	}
	return getFullPageScreenshotsDataDesktop(takeScreenshot, executor, fullPageScrollTimeout, instanceData);
}