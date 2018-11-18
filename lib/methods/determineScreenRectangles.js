import { calculateDprRectangles, getScreenshotSize } from '../helpers/utils';

export default function determineScreenRectangles(screenshot, instanceData) {
	// Determine screenshot data
	const screenshotHeight = getScreenshotSize(screenshot).height / instanceData.dimensions.window.devicePixelRatio;
	const screenshotWidth = getScreenshotSize(screenshot).width / instanceData.dimensions.window.devicePixelRatio;

	// An Android chromedriver screenshot still has the toolbar in the screenshot, but not shown
	const isAndroidChromeDriverScreenshot = instanceData.isAndroidChromeDriverScreenshot;
	const innerHeight = instanceData.dimensions.window.innerHeight;
	const innerWidth = isAndroidChromeDriverScreenshot ? screenshotWidth : instanceData.dimensions.window.innerWidth;
	const isLargeScreenshot = screenshotHeight > innerHeight;

	// Determine the rectangles
	return calculateDprRectangles({
		height: isLargeScreenshot && !isAndroidChromeDriverScreenshot ? screenshotHeight : innerHeight,
		width: innerWidth,
		x: 0,
		y: 0
	}, instanceData.dimensions.window.devicePixelRatio);
}
