import { calculateDprData, getScreenshotSize, waitFor } from '../helpers/utils';
import takeBase64Screenshot from './takeBase64Screenshot';
import scrollToPosition from '../clientSideScripts/scrollToPosition';
import getDocumentScrollHeight from '../clientSideScripts/getDocumentScrollHeight';
import determineIosStatusAddressBarHeight from '../clientSideScripts/determineIosStatusAddressBarHeight';
import { OFFSETS } from '../helpers/constants';

/**
 * Take a full page screenshots
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
export async function getFullPageScreenshotsDataIos(takeScreenshot, executor, fullPageScrollTimeout, instanceData) {
	const viewportScreenshots = [];

	// The addressBarShadowPadding and toolBarShadowPadding is used because the viewport has a shadow on the addressbar and the toolbar
	// so the cutout of the vieport needs to be a little bit smaller
	const { addressBarShadowPadding, toolBarShadowPadding } = instanceData;
	const { devicePixelRatio, innerHeight } = instanceData.dimensions.window;
	const iosViewportHeight = innerHeight - addressBarShadowPadding - toolBarShadowPadding;
	const statusAddressBarHeight = await executor(determineIosStatusAddressBarHeight, OFFSETS.IOS);

	// Start with an empty array, during the scroll it will be filled because a page could also have a lazy loading
	const amountOfScrollsArray = [];
	let scrollHeight;
	let screenshotSizeWidth;

	for (let i = 0; i <= amountOfScrollsArray.length; i++) {
		// Determine and start scrolling
		const scrollY = iosViewportHeight * i;
		await executor(scrollToPosition, scrollY);

		// Simply wait the amount of time specified for lazy-loading
		await waitFor(fullPageScrollTimeout);

		// Take the screenshot and get the width
		const screenshot = await takeBase64Screenshot(takeScreenshot);
		screenshotSizeWidth = getScreenshotSize(screenshot, devicePixelRatio).width;

		// Determine scroll height and check if we need to scroll again
		scrollHeight = await executor(getDocumentScrollHeight);
		if (((scrollY + iosViewportHeight) < scrollHeight)) {
			amountOfScrollsArray.push(amountOfScrollsArray.length);
		}
		// There is no else

		// The height of the image of the last 1 could be different
		const imageHeight = amountOfScrollsArray.length === i ? scrollHeight - scrollY : iosViewportHeight;

		// The starting position for cropping could be different for the last image
		// The cropping always needs to start at status and address bar height and the address bar shadow padding
		const imageYPosition = (amountOfScrollsArray.length === i ? innerHeight - imageHeight : 0) + statusAddressBarHeight + addressBarShadowPadding;

		// Store all the screenshot data in the screenshot object
		viewportScreenshots.push({
			...calculateDprData({
				canvasWidth: screenshotSizeWidth,
				canvasYPosition: scrollY,
				imageHeight: imageHeight,
				imageWidth: screenshotSizeWidth,
				imageYPosition: imageYPosition,
			}, devicePixelRatio),
			screenshot,
		});
	}

	return {
		...calculateDprData({
			fullPageHeight: scrollHeight - addressBarShadowPadding - toolBarShadowPadding,
			fullPageWidth: screenshotSizeWidth,
		}, devicePixelRatio),
		data: viewportScreenshots,
	};
}