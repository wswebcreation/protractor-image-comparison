import { calculateDprRectangles, getScreenshotSize } from '../helpers/utils';

/**
 * Determine the rectangles of the screenshot
 *
 * @param {string} screenshot    The screenshot
 * @param {object} instanceData  The instance data
 *
 * @return {{
 *   height: number,
 *   width: number,
 *   x: number,
 *   y: number,
 * }}
 */
export default function determineScreenRectangles(screenshot, instanceData) {
	// Determine screenshot data
	const { devicePixelRatio, innerHeight, innerWidth } = instanceData.dimensions.window;
	const { isIos, isAndroidChromeDriverScreenshot, isAndroidNativeWebScreenshot } = instanceData;
	const { height, width } = getScreenshotSize(screenshot);

	// Determine the width
	// An Android chromedriver screenshot still has the toolbar in the screenshot, but not shown
	const screenshotWidth = isAndroidChromeDriverScreenshot ? width / devicePixelRatio : innerWidth;

	// Determine the rectangles
	return calculateDprRectangles({
		height: isIos || isAndroidNativeWebScreenshot ? height / devicePixelRatio : innerHeight,
		width: screenshotWidth,
		x: 0,
		y: 0
	}, devicePixelRatio);
}
