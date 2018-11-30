import saveScreen from './saveScreen';
import executeImageCompare from '../methods/executeImageCompare';

/**
 * Saves an image of the viewport of the screen
 *
 * @param {object}   methods                The tag that is used
 * @param {function} methods.executor       The executor function to inject JS into the browser
 * @param {function} methods.screenShot     The screenshot method to take a screenshot
 * @param {object}   instanceData           Instance data, see getInstanceData
 * @param {object}   folders                All the folders that can be used
 * @param {string}   folders.actualFolder   The actual folder
 * @param {string}   folders.baselineFolder The baseline folder
 * @param {string}   folders.diffFolder     The folder where the diff should be saved
 * @param {string}   tag                    The tag that is used
 * @param {object}   options                {defaultOptions} + the options provided by this method
 *
 * @returns {Promise<string>}
 */
export default async function checkScreen(methods, instanceData, folders, tag, options) {
	// Take the actual screenshot and retrieve the needed data
	const { fileName } = await saveScreen(methods, instanceData, folders, tag, options);

	const folderOptions = {
		autoSaveBaseline: options.autoSaveBaseline,
		actualFolder: folders.actualFolder,
		baselineFolder: folders.baselineFolder,
		diffFolder: folders.diffFolder,
		browserName: instanceData.browserName,
		deviceName: instanceData.deviceName,
		isMobile: instanceData.isMobile,
		savePerInstance: options.savePerInstance,
	};

	return executeImageCompare(folderOptions, fileName, options.compareOptions, options.debug)
}
