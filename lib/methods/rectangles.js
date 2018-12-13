import { calculateDprData, checkAndroidNativeWebScreenshot, checkIsIos, getScreenshotSize } from '../helpers/utils';
import { getElementPositionAndroid, getElementPositionDesktop, getElementPositionIos } from './elementPosition';
import { getIosStatusAddressToolBarHeight } from '../clientSideScripts/getIosStatusAddressToolBarHeight';
import { OFFSETS } from '../helpers/constants';
import getAndroidStatusAddressToolBarHeight from '../clientSideScripts/getAndroidStatusAddressToolBarHeight';

/**
 * Determine the element rectangles on the page / screenshot
 *
 * @param {function} executor                             The function to execute JS in the browser
 * @param {string}   screenshot                           The screenshot
 * @param {object}   options                              Current instance data
 * @param {number}   options.devicePixelRatio             The device pixel ration of the screen / device
 * @param {boolean}  options.isAndroidNativeWebScreenshot If this is an Android native screenshot
 * @param {number}   options.innerHeight                  The inner height of a screen
 * @param {boolean}  options.isAndroid                    If this is an Android device
 * @param {boolean}  options.isIos                        If this is an iOS device
 * @param {element}  element                              The element
 *
 * @returns {Promise<{
 *     height: number,
 *     width: number,
 *     x: number,
 *     y: number,
 * }>}
 */
export async function determineElementRectangles(executor, screenshot, options, element) {
	// Determine screenshot data
	const { devicePixelRatio, innerHeight, isAndroid, isAndroidNativeWebScreenshot, isIos } = options;
	const { height } = getScreenshotSize(screenshot, devicePixelRatio);
	let elementPosition;

	// Determine the element position on the screenshot
	if (isIos) {
		elementPosition = await getElementPositionIos(executor, element);
	} else if (isAndroid) {
		elementPosition = await getElementPositionAndroid(executor, isAndroidNativeWebScreenshot, element);
	} else {
		elementPosition = await getElementPositionDesktop(executor, innerHeight, height, element);
	}

	// Determine the rectangles based on the device pixel ratio
	return calculateDprData({
		height: elementPosition.height,
		width: elementPosition.width,
		x: elementPosition.x,
		y: elementPosition.y,
	}, devicePixelRatio);
}

/**
 * Determine the rectangles of the screenshot
 *
 * @param {string}  screenshot                              The screenshot
 * @param {object}  options                                 The rectangles options
 * @param {number}  options.devicePixelRatio                The device pixel ratios
 * @param {number}  options.innerHeight                     The inner height
 * @param {number}  options.innerHeight                     The inner height
 * @param {boolean} options.isAndroidChromeDriverScreenshot If this is an Android ChromeDriver screenshot
 * @param {boolean} options.isAndroidNativeWebScreenshot    If this is an Android native screenshot
 * @param {boolean} options.isIos                            If this is an iOS instance
 *
 * @return {{
 *   height: number,
 *   width: number,
 *   x: number,
 *   y: number,
 * }}
 */
export function determineScreenRectangles(screenshot, options) {
	// Determine screenshot data
	const {
		devicePixelRatio,
		innerHeight,
		innerWidth,
		isIos,
		isAndroidChromeDriverScreenshot,
		isAndroidNativeWebScreenshot,
	} = options;
	const { height, width } = getScreenshotSize(screenshot, devicePixelRatio);

	// Determine the width
	const screenshotWidth = isAndroidChromeDriverScreenshot ? width : innerWidth;

	// Determine the rectangles
	return calculateDprData({
		height: isIos || isAndroidNativeWebScreenshot ? height : innerHeight,
		width: screenshotWidth,
		x: 0,
		y: 0
	}, devicePixelRatio);
}

/**
 * Determine the rectangles for the mobile devices
 *
 * @param {function} executor                             The executor function to inject JS into the browser
 * @param {object}   options                              The options object
 * @param {boolean}  options.isMobile                     If the instance is a mobile phone
 * @param {boolean}  options.isViewPortScreenshot         If the comparison needs to be done for a viewport screenshot or not
 * @param {string}   options.platformName                 The name of the platform
 * @param {boolean}  options.isAndroidNativeWebScreenshot The name of the platform
 * @param {boolean}  options.blockOutStatusBar            If the status and address bar needs to be blocked out
 * @param {boolean}  options.blockOutToolBar              If the tool bar needs to be blocked out
 * @return {Promise<Array>}
 */
export async function determineStatusAddressToolBarRectangles(executor, options) {
	const {
		blockOutStatusBar,
		blockOutToolBar,
		isMobile,
		isViewPortScreenshot,
		platformName,
		isAndroidNativeWebScreenshot,
	} = options;
	const rectangles = [];

	if (isViewPortScreenshot && isMobile &&
		(checkAndroidNativeWebScreenshot(platformName, isAndroidNativeWebScreenshot) || checkIsIos(platformName))
	) {
		const { statusAddressBar, toolBar } = await (checkIsIos(platformName) ?
			executor(getIosStatusAddressToolBarHeight, OFFSETS.IOS) :
			executor(getAndroidStatusAddressToolBarHeight, OFFSETS.ANDROID));

		if (blockOutStatusBar) {
			rectangles.push(statusAddressBar);
		}

		if (blockOutToolBar) {
			rectangles.push(toolBar);
		}
	}

	return rectangles;
}
