import { calculateDprData, getScreenshotSize, waitFor } from '../helpers/utils';
import takeBase64Screenshot from './takeBase64Screenshot';
import scrollToPosition from '../clientSideScripts/scrollToPosition';
import getDocumentScrollHeight from '../clientSideScripts/getDocumentScrollHeight';

/**
 * Take a full page screenshots
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
export default async function getFullPageScreenshotsDataDesktop(takeScreenshot, executor, fullPageScrollTimeout, instanceData) {
	const viewportScreenshots = [];
	const { devicePixelRatio, innerHeight } = instanceData.dimensions.window;

	// Start with an empty array, during the scroll it will be filled because a page could also have a lazy loading
	const amountOfScrollsArray = [];
	let scrollHeight;
	let screenshotSize;

	for (let i = 0; i <= amountOfScrollsArray.length; i++) {
		// Determine and start scrolling
		const scrollY = innerHeight * i;
		await executor(scrollToPosition, scrollY);

		// Simply wait the amount of time specified for lazy-loading
		await waitFor(fullPageScrollTimeout);

		// Take the screenshot
		const screenshot = await takeBase64Screenshot(takeScreenshot);
		screenshotSize = getScreenshotSize(screenshot, devicePixelRatio);

		// Determine scroll height and check if we need to scroll again
		scrollHeight = await executor(getDocumentScrollHeight);

		if (((scrollY + innerHeight) < scrollHeight && screenshotSize.height === innerHeight)) {
			amountOfScrollsArray.push(amountOfScrollsArray.length);
		}
		// There is no else, Lazy load and large screenshots,
		// like with older drivers such as FF <= 47 and IE11, will not work

		// The height of the image of the last 1 could be different
		const imageHeight = amountOfScrollsArray.length === i ? scrollHeight - (innerHeight * viewportScreenshots.length) : screenshotSize.height;
		// The starting position for cropping could be different for the last image (0 means no cropping)
		const imageYPosition = (amountOfScrollsArray.length === i && amountOfScrollsArray.length !== 0) ? innerHeight - imageHeight : 0;

		// Store all the screenshot data in the screenshot object
		viewportScreenshots.push({
			...calculateDprData({
				canvasWidth: screenshotSize.width,
				canvasYPosition: scrollY,
				imageHeight: imageHeight,
				imageWidth: screenshotSize.width,
				imageYPosition: imageYPosition,
			}, devicePixelRatio),
			screenshot,
		});
	}

	return {
		...calculateDprData({
			fullPageHeight: scrollHeight,
			fullPageWidth: screenshotSize.width,
		}, devicePixelRatio),
		data: viewportScreenshots,
	};
}