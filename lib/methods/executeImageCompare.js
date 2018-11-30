import { getAndCreatePath } from '../helpers/utils';
import { join } from 'path';
import { checkBaselineImageExists } from './checkBaselineImageExists';
import compareImages from '../resemble/compareImages';
import { readFileSync } from 'fs-extra';
import saveBase64Image from './saveBase64Image';
import { yellow } from 'chalk';

/**
 *
 * @param {object}  folderOptions                         The folders object
 * @param {boolean} folderOptions.autoSaveBaseline        Auto save image to baseline
 * @param {string}  folderOptions.actualFolder            The actual folder
 * @param {string}  folderOptions.baselineFolder          The baseline folder
 * @param {string}  folderOptions.browserName              The name of the browser
 * @param {string}  folderOptions.deviceName              The name of the device
 * @param {string}  folderOptions.diffFolder              The diff folder
 * @param {boolean} folderOptions.isMobile                Is the instance a mobile instance
 * @param {boolean} folderOptions.savePerInstance         If the folder needs to have the instance name in it
 * @param {string}  fileName                              The name of the file
 * @param {object}  compareOptions                        The compare options
 * @param {array}   compareOptions.blockOut               Block out array with x, y, width and height values
 * @param {boolean} compareOptions.blockOutStatusBar      Block out the status bar yes or no
 * @param {boolean} compareOptions.debug                  Debug the comparison with extra logging
 * @param {boolean} compareOptions.ignoreAlpha            Compare images and discard alpha
 * @param {boolean} compareOptions.ignoreAntialiasing     Compare images an discard anti aliasing
 * @param {boolean} compareOptions.ignoreColors           Even though the images are in colour, the comparison wil compare 2 black/white
 *                                                        images
 * @param {boolean} compareOptions.ignoreLess             Compare images and compare with red = 16, green = 16, blue = 16, alpha = 16,
 *                                                        minBrightness=16, maxBrightness=240
 * @param {boolean} compareOptions.ignoreNothing          Compare images and compare with red = 0, green = 0, blue = 0, alpha = 0,
 *                                                        minBrightness=0, maxBrightness=255
 * @param {boolean} compareOptions.ignoreTransparentPixel Will ignore all pixels that have some transparency in one of the images
 * @param {boolean} compareOptions.rawMisMatchPercentage  Default false. If true, return percentage will be like 0.12345678, default is 0.12
 * @param {boolean} compareOptions.returnAllCompareData   Return all the compare data object
 * @param {number}  compareOptions.saveAboveTolerance     Allowable value of misMatchPercentage that prevents saving image with differences
 *
 * @return {Promise<{
 * 		fileName: string,
 * 		folders: {
 * 			actual: string,
 * 			baseline: string,
 * 			diff: string,
 * 		},
 * 		misMatchPercentage: number
 * }>}
 */

export default async function executeImageCompare(folderOptions, fileName, compareOptions) {
	// First create all needed folders
	const createFolderOptions = {
		browserName: folderOptions.browserName,
		deviceName: folderOptions.deviceName,
		isMobile: folderOptions.isMobile,
		savePerInstance: folderOptions.savePerInstance,
	};
	const actualFolder = getAndCreatePath(folderOptions.actualFolder, createFolderOptions);
	const baselineFolder = getAndCreatePath(folderOptions.baselineFolder, createFolderOptions);
	const actualFilePath = join(actualFolder, fileName);
	const baselineFilePath = join(baselineFolder, fileName);
	let diffFilePath;

	// Check if there is a baseline image, and determine if it needs to be auto saved or not
	await checkBaselineImageExists(actualFilePath, baselineFilePath, folderOptions.autoSaveBaseline);

	// Now compare
	const ignoreRectangles = 'blockOut' in compareOptions ? compareOptions.blockOut : [];
	const options = {
		ignore: []
	};

	// Add the ignore options
	if (compareOptions.ignoreAlpha) {
		options.ignore.push('alpha')
	}
	if (compareOptions.ignoreAntialiasing) {
		options.ignore.push('antialiasing')
	}
	if (compareOptions.ignoreColors) {
		options.ignore.push('colors')
	}
	if (compareOptions.ignoreLess) {
		options.ignore.push('less')
	}
	if (compareOptions.ignoreNothing) {
		options.ignore.push('nothing')
	}

	// If mobile, make sure the status bar, address bar and the toolbar are excluded

	// If iPhoneX, make sure the home handle is blocked out during the comparison

	// @TODO: need to have the devicePixelRatio
	// options.ignoreRectangles = ignoreRectangles.concat('mobile stuff');
	// options.ignoreRectangles = options.ignoreRectangles.map(rectangles => calculateDprData(rectangles, devicePixelRatio));
	options.ignoreTransparentPixel = compareOptions.ignoreTransparentPixel;

	// Execute the compare and retrieve the data
	const data = await compareImages(
		readFileSync(baselineFilePath),
		readFileSync(actualFilePath),
		options
	);
	const misMatchPercentage = compareOptions.rawMisMatchPercentage ? data.rawMisMatchPercentage : Number(data.rawMisMatchPercentage.toFixed(2));

	// Save the diff when there is a diff or when debug mode is on
	if (misMatchPercentage > compareOptions.saveAboveTolerance || compareOptions.debug) {
		const diffFolder = getAndCreatePath(folderOptions.diffFolder, createFolderOptions);
		diffFilePath = join(diffFolder, fileName);

		await saveBase64Image(Buffer.from(data.getBuffer()).toString('base64'), diffFilePath);

		console.log(yellow(`
#####################################################################################
 WARNING: 
 There was a difference. Saved the difference to:
 ${ diffFilePath }
#####################################################################################
`));
	}

	// Return the comparison data
	return compareOptions.returnAllCompareData ? {
		fileName,
		folders: {
			actual: actualFilePath,
			baseline: baselineFilePath,
			...(diffFilePath ? { diff: diffFilePath } : {}),
		},
		misMatchPercentage,
	} : misMatchPercentage;
}