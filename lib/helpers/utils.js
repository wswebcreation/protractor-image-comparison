import { PLATFORMS } from './constants';

/**
 * Format the filename
 *
 * @param {string}  formatString  The format is needs to be
 * @param {string}  tag           The tag
 * @param {object}  instanceData  the data of the current running instance
 *
 * @returns {string}
 */
export function formatFileName(formatString, tag, instanceData) {
	let defaults = {
		'browserName': instanceData.browserName,
		'deviceName': instanceData.deviceName,
		'dpr': instanceData.dimensions.window.devicePixelRatio,
		'height': instanceData.dimensions.window[ instanceData.isMobile ? 'screenHeight' : 'outerHeight' ],
		'logName': instanceData.logName,
		'mobile': (instanceData.isMobile && instanceData.testInBrowser) ? instanceData.browserName : instanceData.isMobile ? 'app' : '',
		'name': instanceData.name,
		'tag': tag,
		'width': instanceData.dimensions.window[ instanceData.isMobile ? 'screenWidth' : 'outerWidth' ]
	};

	Object.keys(defaults).forEach((value) => {
		formatString = formatString.replace(`{${value}}`, defaults[ value ]);
	});

	return `${formatString.replace(/ /g, '_')}.png`;
}


/**
 * Checks if it is monile
 *
 * @param {string} platformName
 *
 * @returns {boolean}
 */
export function instanceIsMobile(platformName) {
	return platformName !== '';
}


/**
 * Checks if the os is Android
 *
 * @param {string} platformName
 *
 * @returns {boolean}
 */
export function platformIsAndroid(platformName) {
	return platformName.toLowerCase() === PLATFORMS.ANDROID;
}

/**
 * Checks if the os is IOS
 *
 * @param {string} platformName
 *
 * @returns {boolean}
 */
export function platformIsIos(platformName) {
	return platformName.toLowerCase() === PLATFORMS.IOS;
}

/**
 * Calculate the rectangles based on the device pixel ratio
 *
 * @param {object} rectangles
 * @param {number} devicePixelRatio
 *
 * @return {object}
 */
export function calculateDprRectangles(rectangles, devicePixelRatio) {
	Object.keys(rectangles).map((key) => rectangles[ key ] *= devicePixelRatio);

	return rectangles;
}

/**
 * Wait for an amount of milliseconds
 *
 * @param {number}  milliseconds the amount of milliseconds
 *
 * @returns {Promise<void>}
 */
export async function waitFor(milliseconds) {
	return new Promise(resolve => setTimeout(() => resolve(), milliseconds));
}

/**
 * Get the size of a screenshot
 *
 * @param  {string}  screenshot   the screenshot
 *
 * @returns {
 * 	{
 * 		height: number,
 * 		width: number,
 * 	}
 * }
 */
export function getScreenshotSize(screenshot) {
	return {
		height: Buffer(screenshot, 'base64').readUInt32BE(20),
		width: Buffer(screenshot, 'base64').readUInt32BE(16),
	}
}
