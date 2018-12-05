import hideScrollBars from '../clientSideScripts/hideScrollBars';
import removeCustomCss from '../clientSideScripts/removeCustomCss';
import { CUSTOM_CSS_ID } from './constants';
import { formatFileName, getAndCreatePath } from './utils';
import { saveBase64Image } from '../methods/images';
import { join } from 'path';

/**
 * Methods that need to be executed after a screenshot has been taken
 * to set all back to the original state
 *
 * @param {function} executor                          The function to execute JS in the browser
 * @param {object}   options                           The options object that will hold all the options
 * @param {string}   options.actualFolder              The actual folder where the images need to be saved
 * @param {string}   options.base64Image               The image
 * @param {boolean}  options.hideScrollBars            If scrollbars need to be hidden
 * @param {object}   options.filePath                  The file path options
 * @param {string}   options.filePath.browserName      The name of the browser
 * @param {string}   options.filePath.deviceName       The name of the device
 * @param {boolean}  options.filePath.isMobile         Is the instance a mobile
 * @param {boolean}  options.filePath.savePerInstance  If the folder needs to have the instance name in it
 * @param {object}   options.fileName                  The file name options object
 * @param {string}   options.fileName.browserName      The browser name
 * @param {string}   options.fileName.deviceName       The device name
 * @param {number}   options.fileName.devicePixelRatio The device pixel ratio
 * @param {string}   options.fileName.formatString     The string that needs to be formated
 * @param {boolean}  options.fileName.isMobile         Is this a mobile
 * @param {boolean}  options.fileName.isTestInBrowser  Is the test executed in a browser
 * @param {string}   options.fileName.logName          The log name of the instance
 * @param {string}   options.fileName.name             The the name of the instance
 * @param {number}   options.fileName.outerHeight      The outer height of the screen
 * @param {number}   options.fileName.outerWidth       The outer width of the screen
 * @param {number}   options.fileName.screenHeight     The height of the screen
 * @param {number}   options.fileName.screenWidth      The width of the screen
 * @param {string}   options.fileName.tag              The tag of the image
 *
 * @returns {Promise<{
 *   fileName: string,
 *   path: string,
 * }>}
 */
export default async function afterScreenshot(executor, options) {
	const { actualFolder, base64Image, fileName: fileNameOptions, filePath, hideScrollBars: noScrollBars } = options;

	// Get the path
	const path = getAndCreatePath(actualFolder, filePath);

	// Get the filePath
	const fileName = formatFileName(fileNameOptions);

	// Save the element
	await saveBase64Image(base64Image, join(path, fileName));

	// Show the scrollbars again
	await executor(hideScrollBars, !noScrollBars);

	// Remove the custom set css
	await executor(removeCustomCss, CUSTOM_CSS_ID);

	// Return the needed data
	return {
		fileName,
		path
	};
}
