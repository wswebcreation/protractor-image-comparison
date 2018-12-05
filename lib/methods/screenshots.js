import scrollToPosition from '../clientSideScripts/scrollToPosition';
import getDocumentScrollHeight from '../clientSideScripts/getDocumentScrollHeight';
import determineAndroidStatusAddressBarHeight from '../clientSideScripts/determineAndroidStatusAddressBarHeight';
import { determineIosStatusAddressBarHeight } from '../clientSideScripts/determineIosStatusAddressBarHeight';
import { OFFSETS } from '../helpers/constants';
import { calculateDprData, getScreenshotSize, waitFor } from '../helpers/utils';

/**
 * @typedef fullPageScreenshotData
 * @type {object}
 * @property {number} fullPageHeight       The height of the full page
 * @property {number} fullPageWidth        The width of the full page
 * @property {array}  data
 * @property {number} data.canvasWidth     The width of the canvas
 * @property {number} data.canvasYPosition The y position on the  canvas
 * @property {number} data.imageHeight     The height if the image
 * @property {number} data.imageWidth      The width of the image
 * @property {number} data.imageYPosition  The y position in the image to start from
 * @property {string} data.screenshot      The screenshot itself
 */

/**
 * Take a full page screenshots for desktop / iOS / Android
 *
 * @param {function} takeScreenshot                          The screenshot method
 * @param {function} executor                                The command to execute js in the browser
 * @param {object}   options                                 The instance data
 * @param {number}   options.addressBarShadowPadding         The address bar padding for iOS or Android
 * @param {number}   options.devicePixelRatio                The device pixel ratio
 * @param {number}   options.fullPageScrollTimeout           The amount of milliseconds to wait for a new scroll
 * @param {number}   options.innerHeight                     The innerheight
 * @param {boolean}  options.isAndroid                       If the instance is an Android device
 * @param {boolean}  options.isAndroidNativeWebScreenshot    If this is an Android native screenshot
 * @param {boolean}  options.isAndroidChromeDriverScreenshot If this is an Android ChromeDriver screenshot
 * @param {boolean}  options.isIos                           If the instance is an iOS device
 * @param {number}   options.toolBarShadowPadding            The address bar padding for iOS or Android
 *
 * @returns {Promise<fullPageScreenshotData>}
 */
export async function getBase64FullPageScreenshotsData(takeScreenshot, executor, options) {
	const {
		addressBarShadowPadding,
		devicePixelRatio,
		fullPageScrollTimeout,
		innerHeight,
		isAndroid,
		isAndroidNativeWebScreenshot,
		isAndroidChromeDriverScreenshot,
		isIos,
		toolBarShadowPadding,
	} = options;
	const desktopOptions = {
		devicePixelRatio,
		fullPageScrollTimeout,
		innerHeight,
	};
	const nativeMobileOptions = {
		...desktopOptions,
		addressBarShadowPadding,
		toolBarShadowPadding,
	};

	if (isAndroid && isAndroidNativeWebScreenshot) {
		// Create a fullpage screenshot for Android when native screenshot (so including status, address and toolbar) is created
		const statusAddressBarHeight = await executor(determineAndroidStatusAddressBarHeight, OFFSETS.ANDROID);
		const androidNativeMobileOptions = { ...nativeMobileOptions, statusAddressBarHeight };

		return getFullPageScreenshotsDataNativeMobile(takeScreenshot, executor, androidNativeMobileOptions);
	} else if (isAndroid && isAndroidChromeDriverScreenshot) {
		const chromeDriverOptions = { devicePixelRatio, fullPageScrollTimeout, innerHeight };

		// Create a fullpage screenshot for Android when the ChromeDriver provides the screenshots
		return getFullPageScreenshotsDataAndroidChromeDriver(takeScreenshot, executor, chromeDriverOptions);
	} else if (isIos) {
		// Create a fullpage screenshot for iOS. iOS screenshots will hold the status, address and toolbar so they need to be removed
		const statusAddressBarHeight = await executor(determineIosStatusAddressBarHeight, OFFSETS.IOS);
		const iosNativeMobileOptions = { ...nativeMobileOptions, statusAddressBarHeight };

		return getFullPageScreenshotsDataNativeMobile(takeScreenshot, executor, iosNativeMobileOptions);
	}
	// Create a fullpage screenshot for all desktops
	return getFullPageScreenshotsDataDesktop(takeScreenshot, executor, desktopOptions);
}

/**
 * Take a full page screenshots
 *
 * @param {function} takeScreenshot                  The screenshot method
 * @param {function} executor                        The command to execute js in the browser
 * @param {object}   options                         The instance data
 * @param {number}   options.addressBarShadowPadding The address bar padding for iOS or Android
 * @param {number}   options.devicePixelRatio        The device pixel ratio
 * @param {number}   options.fullPageScrollTimeout   The amount of milliseconds to wait for a new scroll
 * @param {number}   options.innerHeight             The innerheight
 * @param {number}   options.statusAddressBarHeight  The height of the status and the address bar
 * @param {number}   options.toolBarShadowPadding    The address bar padding for iOS or Android
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
export async function getFullPageScreenshotsDataNativeMobile(takeScreenshot, executor, options) {
	const viewportScreenshots = [];

	// The addressBarShadowPadding and toolBarShadowPadding is used because the viewport has a shadow on the address and the tool bar
	// so the cutout of the vieport needs to be a little bit smaller
	const {
		addressBarShadowPadding,
		devicePixelRatio,
		fullPageScrollTimeout,
		innerHeight,
		statusAddressBarHeight,
		toolBarShadowPadding,
	} = options;
	const iosViewportHeight = innerHeight - addressBarShadowPadding - toolBarShadowPadding;

	// Start with an empty array, during the scroll it will be filled because a page could also have a lazy loading
	const amountOfScrollsArray = [];
	let scrollHeight;
	let screenshotSizeWidth;

	for (let i = 0; i <= amountOfScrollsArray.length; i++) {
		// Determine and start scrolling
		const scrollY = iosViewportHeight * i;
		await
			executor(scrollToPosition, scrollY);

		// Simply wait the amount of time specified for lazy-loading
		await
			waitFor(fullPageScrollTimeout);

		// Take the screenshot and get the width
		const screenshot = await
			takeBase64Screenshot(takeScreenshot);
		screenshotSizeWidth = getScreenshotSize(screenshot, devicePixelRatio).width;

		// Determine scroll height and check if we need to scroll again
		scrollHeight = await
			executor(getDocumentScrollHeight);
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

/**
 * Take a full page screenshot for Android with Chromedriver
 *
 * @param {function} takeScreenshot                The screenshot method
 * @param {function} executor                      The command to execute js in the browser
 * @param {object}   options                       The instance data
 * @param {number}   options.devicePixelRatio      The device pixel ratio
 * @param {number}   options.fullPageScrollTimeout The timeout to wait after a scroll
 * @param {number}   options.innerHeight           The innerheight
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
export async function getFullPageScreenshotsDataAndroidChromeDriver(takeScreenshot, executor, options) {
	const viewportScreenshots = [];
	const { devicePixelRatio, fullPageScrollTimeout, innerHeight } = options;

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
		if ((scrollY + innerHeight) < scrollHeight) {
			amountOfScrollsArray.push(amountOfScrollsArray.length);
		}
		// There is no else

		// The height of the image of the last 1 could be different
		const imageHeight = amountOfScrollsArray.length === i ? scrollHeight - (innerHeight * viewportScreenshots.length) : innerHeight;
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
		})
	}

	return {
		...calculateDprData({
			fullPageHeight: scrollHeight,
			fullPageWidth: screenshotSize.width,
		}, devicePixelRatio),
		data: viewportScreenshots,
	};
}

/**
 * Take a full page screenshots
 *
 * @param {function} takeScreenshot                The screenshot method
 * @param {function} executor                      The command to execute js in the browser
 * @param {object}   options                       The instance data
 * @param {number}   options.devicePixelRatio      The device pixel ratio
 * @param {number}   options.fullPageScrollTimeout The timeout to wait after a scroll
 * @param {number}   options.innerHeight           The innerheight
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
export async function getFullPageScreenshotsDataDesktop(takeScreenshot, executor, options) {
	const viewportScreenshots = [];
	const { devicePixelRatio, fullPageScrollTimeout, innerHeight } = options;

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

/**
 * Take a screenshot
 *
 * @param {function} takeScreenshot The screenshot method
 *
 * @returns {Promise<string>}
 */
export async function takeBase64Screenshot(takeScreenshot) {
	return takeScreenshot();
}