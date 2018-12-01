import { join } from 'path';
import { DESKTOP, PLATFORMS } from './constants';
import { ensureDirSync } from 'fs-extra';

/**
 * Get and create a folder
 *
 * @param {string}  folder                  The name of the folder
 * @param {object}  options                 The options object
 * @param {string}  options.browserName     The name of the browser
 * @param {string}  options.deviceName      The name of the device
 * @param {boolean} options.isMobile        Is the instance a mobile
 * @param {boolean} options.savePerInstance If the folder needs to have the instance name in it
 *
 * @return {string}
 */
export function getAndCreatePath(folder, options) {
	const { browserName, deviceName, isMobile, savePerInstance } = options;
	const instanceName = (isMobile ? deviceName : `${ DESKTOP }_${ browserName }`).replace(/ /g, '_');
	const subFolder = savePerInstance ? instanceName : '';
	const folderName = join(folder, subFolder).toLowerCase();

	ensureDirSync(folderName);

	return folderName;
}

/**
 * Format the filename
 *
 * @param {object}  options                  The options object
 * @param {string}  options.browserName      The browser name
 * @param {string}  options.deviceName       The device name
 * @param {number}  options.devicePixelRatio The device pixel ratio
 * @param {string}  options.formatString     The string that needs to be formated
 * @param {boolean} options.isMobile         Is this a mobile
 * @param {boolean} options.isTestInBrowser  Is the test executed in a browser
 * @param {string}  options.logName          The log name of the instance
 * @param {string}  options.name             The the name of the instance
 * @param {number}  options.outerHeight      The outer height of the screen
 * @param {number}  options.outerWidth       The outer width of the screen
 * @param {number}  options.screenHeight     The height of the screen
 * @param {number}  options.screenWidth      The width of the screen
 * @param {string}  options.tag              The tag of the image
 *
 * @returns {string}
 */
export function formatFileName(options) {
	let defaults = {
		'browserName': options.browserName,
		'deviceName': options.deviceName,
		'dpr': options.devicePixelRatio,
		'height': options.isMobile ? options.screenHeight : options.outerHeight,
		'logName': options.logName,
		'mobile': (options.isMobile && options.isTestInBrowser) ? options.browserName : options.isMobile ? 'app' : '',
		'name': options.name,
		'tag': options.tag,
		'width': options.isMobile ? options.screenWidth : options.outerWidth
	};

	let formatString = options.formatString;

	Object.keys(defaults).forEach((value) => {
		formatString = formatString.replace(`{${ value }}`, defaults[ value ]);
	});

	return `${ formatString.replace(/ /g, '_') }.png`;
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
