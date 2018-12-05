import { access, copySync, outputFile, readFileSync } from 'fs-extra';
import { red, yellow } from 'chalk';
import { join } from 'path';
import compareImages from '../resemble/compareImages';
import { getAndCreatePath } from '../helpers/utils';
import { DEFAULT_RESIZE_DIMENSIONS } from '../helpers/constants';

const { createCanvas, loadImage } = require('canvas');

/**
 * Check if the image exists and create a new baseline image if needed
 *
 * @param {string}  actualFilePath   The actual folder
 * @param {string}  baselineFilePath The baseline folder
 * @param {boolean} autoSaveBaseline Auto save image to baseline
 *
 * @return {Promise<{
 *   actualFilePath: string,
 *   baselineFilePath: string,
 * }>}
 */
export async function checkBaselineImageExists(actualFilePath, baselineFilePath, autoSaveBaseline) {

	return new Promise((resolve, reject) => {
		access(baselineFilePath, error => {
			if (error) {
				if (autoSaveBaseline) {
					try {
						copySync(actualFilePath, baselineFilePath);
						console.log(yellow(`
#####################################################################################
 INFO: 
 Autosaved the image to 
 ${ baselineFilePath }
#####################################################################################
`));
					} catch (error) {
						reject(red(`
#####################################################################################
 Image could not be copied. The following error was thrown: 
 ${ error }
#####################################################################################
`));
					}
				} else {
					reject(red(`
#####################################################################################
 Baseline image not found, save the actual image manually to the baseline.
 The image can be found here:
 ${ actualFilePath }
 If you want the module to auto save a non existing image to the baseline you
 can provide 'autoSaveBaseline: true' to the options.
#####################################################################################
`));
				}
			}
			resolve({
				actualFilePath,
				baselineFilePath,
			});
		});
	});
}

/**
 * Execute the image compare
 *
 * @TODO: refactor this method and add mobile options to it
 *
 * @param {object}  options                                       The folders object
 * @param {boolean} options.debug                                 Debug the comparison with extra logging
 * @param {object}  options.compareOptions                        The compare options
 * @param {array}   options.compareOptions.blockOut               Block out array with x, y, width and height values
 * @param {boolean} options.compareOptions.blockOutStatusBar      Block out the status bar yes or no
 * @param {boolean} options.compareOptions.ignoreAlpha            Compare images and discard alpha
 * @param {boolean} options.compareOptions.ignoreAntialiasing     Compare images an discard anti aliasing
 * @param {boolean} options.compareOptions.ignoreColors           Even though the images are in colour, the comparison wil compare 2
 *                                                                black/white images
 * @param {boolean} options.compareOptions.ignoreLess             Compare images and compare with red = 16, green = 16, blue = 16,
 *                                                                alpha = 16, minBrightness=16, maxBrightness=240
 * @param {boolean} options.compareOptions.ignoreNothing          Compare images and compare with red = 0, green = 0, blue = 0, alpha = 0,
 *                                                                minBrightness=0, maxBrightness=255
 * @param {boolean} options.compareOptions.ignoreTransparentPixel Will ignore all pixels that have some transparency in one of the images
 * @param {boolean} options.compareOptions.rawMisMatchPercentage  Default false. If true, return percentage will be like 0.12345678,
 *                                                                default is 0.12
 * @param {boolean} options.compareOptions.returnAllCompareData   Return all the compare data object
 * @param {number}  options.compareOptions.saveAboveTolerance     Allowable value of misMatchPercentage that prevents saving image with
 *                                                                differences
 * @param {string}  options.fileName                              The name of the file
 * @param {object}  options.folderOptions                         The folders object
 * @param {boolean} options.folderOptions.autoSaveBaseline        Auto save image to baseline
 * @param {string}  options.folderOptions.actualFolder            The actual folder
 * @param {string}  options.folderOptions.baselineFolder          The baseline folder
 * @param {string}  options.folderOptions.browserName             The name of the browser
 * @param {string}  options.folderOptions.deviceName              The name of the device
 * @param {string}  options.folderOptions.diffFolder              The diff folder
 * @param {boolean} options.folderOptions.isMobile                Is the instance a mobile instance
 * @param {boolean} options.folderOptions.savePerInstance         If the folder needs to have the instance name in it
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
export async function executeImageCompare(options) {
	// Create all needed folders
	const createFolderOptions = {
		browserName: options.folderOptions.browserName,
		deviceName: options.folderOptions.deviceName,
		isMobile: options.folderOptions.isMobile,
		savePerInstance: options.folderOptions.savePerInstance,
	};
	const actualFolder = getAndCreatePath(options.folderOptions.actualFolder, createFolderOptions);
	const baselineFolder = getAndCreatePath(options.folderOptions.baselineFolder, createFolderOptions);
	const actualFilePath = join(actualFolder, options.fileName);
	const baselineFilePath = join(baselineFolder, options.fileName);
	let diffFilePath;

	// Check if there is a baseline image, and determine if it needs to be auto saved or not
	await checkBaselineImageExists(actualFilePath, baselineFilePath, options.folderOptions.autoSaveBaseline);

	// Now prepare the compare
	const ignoreRectangles = 'blockOut' in options.compareOptions ? options.compareOptions.blockOut : [];
	const resembleIgnoreDefaults = [ 'alpha', 'antialiasing', 'colors', 'less', 'nothing' ];
	const resembleIgnoreOptions = resembleIgnoreDefaults.filter(option =>
		Object.keys(options.compareOptions).find(key =>
			key.toLowerCase().includes(option) && options.compareOptions[ key ]
		));

	const compareOptions = {};

	compareOptions.ignore = resembleIgnoreOptions;

	// If mobile, make sure the status bar, address bar and the toolbar are excluded

	// If iPhoneX, make sure the home handle is blocked out during the comparison

	// @TODO: need to have the devicePixelRatio
	// options.ignoreRectangles = ignoreRectangles.concat('mobile stuff');
	// options.ignoreRectangles = options.ignoreRectangles.map(rectangles => calculateDprData(rectangles, devicePixelRatio));
	compareOptions.ignoreTransparentPixel = options.compareOptions.ignoreTransparentPixel;

	// Execute the compare and retrieve the data
	const data = await compareImages(
		readFileSync(baselineFilePath),
		readFileSync(actualFilePath),
		compareOptions
	);
	const misMatchPercentage = options.compareOptions.rawMisMatchPercentage ? data.rawMisMatchPercentage : Number(data.rawMisMatchPercentage.toFixed(2));

	// Save the diff when there is a diff or when debug mode is on
	if (misMatchPercentage > options.compareOptions.saveAboveTolerance || options.debug) {
		const diffFolder = getAndCreatePath(options.folderOptions.diffFolder, createFolderOptions);
		diffFilePath = join(diffFolder, options.fileName);

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
		fileName: options.fileName,
		folders: {
			actual: actualFilePath,
			baseline: baselineFilePath,
			...(diffFilePath ? { diff: diffFilePath } : {}),
		},
		misMatchPercentage,
	} : misMatchPercentage;
}

/**
 * Make a cropped image with Canvas
 *
 * @param {string}        base64Image             The image in base64
 * @param {object}        rectangles              The rectangles
 * @param {number}        rectangles.height       The height of the rectangle
 * @param {number}        rectangles.width        The width of the rectangle
 * @param {number}        rectangles.x            The x-coordinate of the rectangle
 * @param {number}        rectangles.y            The y-coordinate of the rectangle
 * @param {object|number} resizeDimensions        The resizeDimensions, for backwards compatibility this will be an object or a number
 * @param {number}        resizeDimensions.bottom The bottom margin
 * @param {number}        resizeDimensions.left  The left margin
 * @param {number}        resizeDimensions.right  The right margin
 * @param {number}        resizeDimensions.top    The top margin
 *
 * @returns {string}
 */
export async function makeCroppedBase64Image(base64Image, rectangles, resizeDimensions = DEFAULT_RESIZE_DIMENSIONS) {
	/**
	 * This is in for backwards compatibility, it will be removed in the future
	 */
	let resizeValues;
	if (typeof resizeDimensions === 'number') {
		resizeValues = {
			top: resizeDimensions,
			right: resizeDimensions,
			bottom: resizeDimensions,
			left: resizeDimensions,
		};

		console.log(yellow(`
#####################################################################################
 WARNING:
 THE 'resizeDimensions' NEEDS TO BE AN OBJECT LIKE
 {
    top: 10,
    right: 20,
    bottom: 15,
    left: 25,
 }
 NOW IT WILL BE DEFAULTED TO
  {
    top: ${ resizeDimensions },
    right: ${ resizeDimensions },
    bottom: ${ resizeDimensions },
    left: ${ resizeDimensions },
 }
 THIS IS DEPRACATED AND WILL BE REMOVED IN A NEW MAJOR RELEASE
#####################################################################################
`));
	} else {
		resizeValues = resizeDimensions;
	}

	const { top, right, bottom, left } = { ...DEFAULT_RESIZE_DIMENSIONS, ...resizeValues };
	const { height, width, x, y } = rectangles;
	const canvasWidth = width + left + right;
	const canvasHeight = height + top + bottom;
	const canvas = createCanvas(canvasWidth, canvasHeight);
	const image = await loadImage(`data:image/png;base64,${ base64Image }`);
	const ctx = canvas.getContext('2d');

	let sourceXStart = x - left;
	let sourceYStart = y - top;

	if (sourceXStart < 0) {
		console.log(yellow(`
#####################################################################################
 THE RESIZE DIMENSION LEFT '${ left }' MADE THE CROPPING GO OUT OF
 THE IMAGE BOUNDARIES RESULTING IN AN IMAGE STARTPOSITION '${ sourceXStart }'.
 THIS HAS BEEN DEFAULTED TO '0'
#####################################################################################
`));
		sourceXStart = 0;
	}

	if (sourceYStart < 0) {
		console.log(yellow(`
#####################################################################################
 THE RESIZE DIMENSION LEFT '${ top }' MADE THE CROPPING GO OUT OF
 THE IMAGE BOUNDARIES RESULTING IN AN IMAGE STARTPOSITION '${ sourceYStart }'.
 THIS HAS BEEN DEFAULTED TO '0'
#####################################################################################
`));
		sourceYStart = 0;
	}

	ctx.drawImage(image,
		// Start at x/y pixels from the left and the top of the image (crop)
		sourceXStart, sourceYStart,
		// 'Get' a (w * h) area from the source image (crop)
		canvasWidth, canvasHeight,
		// Place the result at 0, 0 in the canvas,
		0, 0,
		// With as width / height: 100 * 100 (scale)
		canvasWidth, canvasHeight
	);

	return canvas.toDataURL().replace(/^data:image\/png;base64,/, '');
}

/**
 * Make a full page image with Canvas
 *
 * @type {fullPageScreenshotData} screenshotsData
 *
 * @return {Promise<string>}
 */
export async function makeFullPageBase64Image(screenshotsData) {
	const amountOfScreenshots = screenshotsData.data.length;
	const { fullPageHeight: canvasHeight, fullPageWidth: canvasWidth } = screenshotsData;
	const canvas = createCanvas(canvasWidth, canvasHeight);
	const ctx = canvas.getContext('2d');

	// Load all the images
	for (let i = 0; i < amountOfScreenshots; i++) {
		const { canvasYPosition, imageHeight, imageWidth, imageYPosition } = screenshotsData.data[ i ];
		const image = await loadImage(`data:image/png;base64,${ screenshotsData.data[ i ].screenshot }`);

		ctx.drawImage(image,
			// Start at x/y pixels from the left and the top of the image (crop)
			0, imageYPosition,
			// 0, 0,
			// 'Get' a (w * h) area from the source image (crop)
			imageWidth, imageHeight,
			// Place the result at 0, 0 in the canvas,
			0, canvasYPosition,
			// With as width / height: 100 * 100 (scale)
			imageWidth, imageHeight,
		);
	}

	return canvas.toDataURL().replace(/^data:image\/png;base64,/, '');
}

/**
 * Save the base64 image to a file
 *
 * @param {string} base64Image The image
 * @param {string} filePath     The file path
 *
 * @returns {Promise<void>}
 */
export async function saveBase64Image(base64Image, filePath) {
	return outputFile(filePath, base64Image, 'base64');
}