import hideScrollBars from '../clientSideScripts/hideScrollBars';
import removeCustomCss from '../clientSideScripts/removeCustomCss';
import { CUSTOM_CSS_ID } from './constants';
import { formatFileNameNew, getAndCreatePath } from './utils';
import saveBase64Image from '../methods/saveBase64Image';
import { join } from 'path';

/**
 * Methods that need to be executed after a screenshot has been taken
 * to set all back to the original state
 *
 * @param {function} executor                 The function to execute JS in the browser
 * @param {object}   options                  The options object that will hold all the options
 * @param {boolean}  options.autoSaveBaseline
 * @param {string}   options.actualFolder
 * @param {string}   options.base64Image
 * @param {string}   options.browserName
 * @param {string}   options.deviceName
 * @param {number}   options.devicePixelRatio
 * @param {boolean}  options.hideScrollBars
 * @param {boolean}  options.isMobile
 * @param {boolean}  options.isTestInBrowser
 * @param {string}   options.formatString
 * @param {string}   options.logName
 * @param {string}   options.name
 * @param {number}   options.outerHeight
 * @param {number}   options.outerWidth
 * @param {boolean}  options.savePerInstance
 * @param {number}   options.screenHeight
 * @param {number}   options.screenWidth
 * @param {string}   options.tag
 *
 * @returns {Promise<{
 *   fileName: string,
 *   path: string,
 * }>}
 */
export default async function afterScreenshot(executor, options) {
	// Get the path
	const getFilePathOptions = {
		autoSaveBaseline: options.autoSaveBaseline,
		browserName: options.browserName,
		deviceName: options.deviceName,
		isMobile: options.isMobile,
		savePerInstance: options.savePerInstance,
	};
	const path = getAndCreatePath(options.actualFolder, getFilePathOptions);

	// Get the filePath
	const fileNameOptions = {
		browserName: options.browserName,
		deviceName: options.deviceName,
		devicePixelRatio: options.devicePixelRatio,
		isMobile: options.isMobile,
		isTestInBrowser: options.isTestInBrowser,
		logName: options.logName,
		name: options.name,
		outerHeight: options.outerHeight,
		outerWidth: options.outerWidth,
		screenHeight: options.screenHeight,
		screenWidth: options.screenWidth,
		tag: options.tag,
	};
	const fileName = formatFileNameNew(options.formatString, fileNameOptions);

	// Save the element
	await saveBase64Image(options.base64Image, join(path, fileName));

	// Show the scrollbars
	await executor(hideScrollBars, !options.hideScrollBars);

	// Remove the custom set css
	await executor(removeCustomCss, CUSTOM_CSS_ID);

	// Return the needed data
	return {
		fileName,
		path
	};
}
