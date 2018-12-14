import { executeImageCompare } from '../methods/images';
import { checkIsMobile } from '../helpers/utils';
import saveFullPageScreen from './saveFullPageScreen';

/**
 * Compare a fullpage screenshot
 *
 * @param {object}   methods                                       The tag that is used
 * @param {function} methods.executor                              The executor function to inject JS into the browser
 * @param {function} methods.screenShot                            The screenshot method to take a screenshot
 * @param {object}   instanceData                                  Instance data
 * @param {string}   instanceData.browserName                      The browser name of the instance
 * @param {string}   instanceData.deviceName                       The device name of the instance
 * @param {string}   instanceData.logName                          The log name of the instance
 * @param {string}   instanceData.name                             The name of the instance
 * @param {boolean}  instanceData.nativeWebScreenshot              If the instance creates native webscreenshots
 * @param {string}   instanceData.platformName                     The platformname of the instance
 * @param {object}   folders                                       All the folders that can be used
 * @param {string}   folders.actualFolder                          The actual folder
 * @param {string}   folders.baselineFolder                        The baseline folder
 * @param {string}   folders.diffFolder                            The folder where the diff should be saved
 * @param {string}   tag                                           The tag that is used
 * @param {object}   options                                       {defaultOptions} + the options provided by this method
 * @param {number}   options.fullPageScrollTimeout 								 The amount of milliseconds to wait for a new scroll
 * @param {number}   options.addressBarShadowPadding
 * @param {boolean}  options.hideScrollBars
 * @param {boolean}  options.disableCSSAnimation
 * @param {number}   options.toolBarShadowPadding
 * // @TODO: the following 3 options should be module options
 * @param {boolean}  options.autoSaveBaseline                      Create a new baseline if the image doesn't exist
 * @param {boolean}  options.debug                                 Debug the execution
 * @param {boolean}  options.savePerInstance                       Save the images per instance in a folder
 * // @TODO: the following options should come from the defaults or from the method option
 * @param {object}   options.compareOptions                        The compare options
 * @param {array}    options.compareOptions.blockOut               Block out array with x, y, width and height values
 * @param {boolean}  options.compareOptions.blockOutStatusBar      Block out the status bar yes or no
 * @param {boolean}  options.compareOptions.blockOutToolBar        Block out the tool bar yes or no
 * @param {boolean}  options.compareOptions.ignoreAlpha            Compare images and discard alpha
 * @param {boolean}  options.compareOptions.ignoreAntialiasing     Compare images an discard anti aliasing
 * @param {boolean}  options.compareOptions.ignoreColors           Even though the images are in colour, the comparison wil compare 2
 *                                                                 black/white images
 * @param {boolean}  options.compareOptions.ignoreLess             Compare images and compare with red = 16, green = 16, blue = 16,
 *                                                                 alpha = 16, minBrightness=16, maxBrightness=240
 * @param {boolean}  options.compareOptions.ignoreNothing          Compare images and compare with red = 0, green = 0, blue = 0, alpha = 0,
 *                                                                 minBrightness=0, maxBrightness=255
 * @param {boolean}  options.compareOptions.ignoreTransparentPixel Will ignore all pixels that have some transparency in one of the images
 * @param {boolean}  options.compareOptions.rawMisMatchPercentage  Default false. If true, return percentage will be like 0.12345678,
 *                                                                 default is 0.12
 * @param {boolean}  options.compareOptions.returnAllCompareData   Return all the compare data object
 * @param {number}   options.compareOptions.saveAboveTolerance     Allowable value of misMatchPercentage that prevents saving image with
 *                                                                 differences
 *x
 * @returns {Promise<string|object>}
 */
export default async function checkFullPageScreen(methods, instanceData, folders, tag, options) {
	// Take the actual screenshot and retrieve the needed data
	const { devicePixelRatio, fileName } = await saveFullPageScreen(methods, instanceData, folders, tag, options);

	const executeCompareOptions = {
		debug: options.debug,
		devicePixelRatio,
		compareOptions: options.compareOptions,
		fileName,
		folderOptions: {
			autoSaveBaseline: options.autoSaveBaseline,
			actualFolder: folders.actualFolder,
			baselineFolder: folders.baselineFolder,
			diffFolder: folders.diffFolder,
			browserName: instanceData.browserName,
			deviceName: instanceData.deviceName,
			isMobile: checkIsMobile(instanceData.platformName),
			savePerInstance: options.savePerInstance,
		},
		isAndroidNativeWebScreenshot: instanceData.nativeWebScreenshot,
		platformName: instanceData.platformName,
	};

	return executeImageCompare(methods.executor, executeCompareOptions);
}
