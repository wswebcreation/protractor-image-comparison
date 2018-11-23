import { join } from 'path';
import { PLATFORMS } from './constants';
import { ensureDirSync } from 'fs-extra';

/**
 * Get the file path and created the folders if needed
 *
 * @param {string} folder        The folder
 * @param {object} options       The options
 * @param {string} tag           The tag
 * @param {object} instanceData  The data of the current running instance
 *
 * @return {string}
 */
export function getFilePath(folder, options, tag, instanceData) {
	const fileName = formatFileName(options.formatString, tag, instanceData);
	const folderName = getAndCreateFolder(folder, options.savePerInstance, instanceData);

	return join(folderName, fileName);
}

/**
 * Get and create a folder
 *
 * @param {string}   folder           The folder
 * @param {boolean}  savePerInstance  Create a folder per instance
 * @param {object}   instanceData     The data of the current running instance
 *
 * @return {string}
 */
export function getAndCreateFolder(folder, savePerInstance, instanceData) {
	const instanceName = (instanceData.isMobile ? instanceData.deviceName : instanceData.browserName).replace(/ /g, '_');
	const subFolder = savePerInstance ? instanceName : '';
	const folderName = join(folder, subFolder).toLowerCase();

	ensureDirSync(folderName);

	return folderName;
}

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
		'mobile': (instanceData.isMobile && instanceData.isTestInBrowser) ? instanceData.browserName : instanceData.isMobile ? 'app' : '',
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
 * Checks if it is mobile
 *
 * @param {string} platformName
 *
 * @returns {boolean}
 */
export function checkIsMobile(platformName) {
	return platformName !== '';
}

/**
 * Checks if the os is Android
 *
 * @param {string} platformName
 *
 * @returns {boolean}
 */
export function checkIsAndroid(platformName) {
	return platformName.toLowerCase() === PLATFORMS.ANDROID;
}

/**
 * Checks if the os is IOS
 *
 * @param {string} platformName
 *
 * @returns {boolean}
 */
export function checkIsIos(platformName) {
	return platformName.toLowerCase() === PLATFORMS.IOS;
}

/**
 * Checks if the test is executed in a browser
 *
 * @param {string} browserName
 *
 * @returns {boolean}
 */
export function checkTestInBrowser(browserName) {
	return browserName !== '';
}

/**
 * Checks if the test is executed in a browser on a mobile phone
 *
 * @param {string} platformName
 * @param {string} browserName
 *
 * @returns {boolean}
 */
export function checkTestInMobileBrowser(platformName, browserName) {
	return checkIsMobile(platformName) && checkTestInBrowser(browserName);
}

/**
 * Checks if this is a native webscreenshot on android
 *
 * @param {string}  platformName
 * @param {boolean} nativeWebscreenshot
 *
 * @returns {boolean}
 */
export function checkAndroidNativeWebScreenshot(platformName, nativeWebscreenshot) {
	return (checkIsAndroid(platformName) && nativeWebscreenshot) || false;
}

/**
 * Checks if this is an Android chromedriver screenshot
 *
 * @param {string}  platformName
 * @param {boolean} nativeWebScreenshot
 *
 * @returns {boolean}
 */
export function checkAndroidChromeDriverScreenshot(platformName, nativeWebScreenshot) {
	return checkIsAndroid(platformName) && !checkAndroidNativeWebScreenshot(platformName, nativeWebScreenshot);
}

/**
 * Get the address bar shadow padding. This is only needed for Android native webscreenshot and iOS
 *
 * @param {string}  platformName             The platform name
 * @param {string}  browserName              The browser name
 * @param {boolean} nativeWebScreenshot      If it is an Android native webscreenshot
 * @param {number}  addressBarShadowPadding  The address bar shadow padding value
 * @param {boolean} addShadowPadding         Shadow padding needs to be added on Android (nativeWebScreenshots) and iOS element/fullpage
 *
 * @returns {number}
 */
export function getAddressBarShadowPadding(platformName, browserName, nativeWebScreenshot, addressBarShadowPadding, addShadowPadding) {
	const isTestInMobileBrowser = checkTestInMobileBrowser(platformName, browserName);
	const isAndroidNativeWebScreenshot = checkAndroidNativeWebScreenshot(platformName, nativeWebScreenshot);
	const isAndroid = checkIsAndroid(platformName);
	const isIos = checkIsIos(platformName);

	return isTestInMobileBrowser && ((isAndroidNativeWebScreenshot && isAndroid) || isIos) && addShadowPadding ? addressBarShadowPadding : 0;
}

/**
 * Get the tool bar shadow padding. This is only needed for iOS
 *
 * @param {string}  platformName         The platform name
 * @param {string}  browserName          The browser name
 * @param {number}  toolBarShadowPadding The tool bar shadow padding
 * @param {boolean} addShadowPadding     Shadow padding needs to be added on iOS fullpage
 *
 * @returns {number}
 */
export function getToolBarShadowPadding(platformName, browserName, toolBarShadowPadding, addShadowPadding) {
	return checkTestInMobileBrowser(platformName, browserName) && checkIsIos(platformName) && addShadowPadding ? toolBarShadowPadding : 0;
}

/**
 * Calculate the data based on the device pixel ratio
 *
 * @param {object} data
 * @param {number} devicePixelRatio
 *
 * @return {object}
 */
export function calculateDprData(data, devicePixelRatio) {
	Object.keys(data).map((key) => data[ key ] *= devicePixelRatio);

	return data;
}

/**
 * Wait for an amount of milliseconds
 *
 * @param {number} milliseconds the amount of milliseconds
 *
 * @returns {Promise<void>}
 */
export async function waitFor(milliseconds) {
	return new Promise(resolve => setTimeout(() => resolve(), milliseconds));
}

/**
 * Get the size of a screenshot in pixels without the device pixel ratio
 *
 * @param {string} screenshot        The screenshot
 * @param {number} devicePixelRation The device pixel ratio, optional
 *
 * @returns {
 * 	{
 * 		height: number,
 * 		width: number,
 * 	}
 * }
 */
export function getScreenshotSize(screenshot, devicePixelRation = 1) {
	return {
		height: Buffer(screenshot, 'base64').readUInt32BE(20) / devicePixelRation,
		width: Buffer(screenshot, 'base64').readUInt32BE(16) / devicePixelRation,
	}
}
