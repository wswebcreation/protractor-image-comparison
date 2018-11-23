import { yellow } from 'chalk';
import { DEFAULT_RESIZE_DIMENSIONS } from '../helpers/constants';

const { createCanvas, loadImage } = require('canvas');

/**
 * Make a cropped image with Canvas
 *
 * @param   {string}        base64Image       The image in base64
 * @param   {object}        rectangles        The rectangles
 * @param   {object|number} resizeDimensions  The resizeDimensions, for backwards compatibility this will be an object or a number
 *
 * @returns {string}
 */
export default async function makeCroppedBase64Image(base64Image, rectangles, resizeDimensions = DEFAULT_RESIZE_DIMENSIONS) {
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
    top: ${resizeDimensions},
    right: ${resizeDimensions},
    bottom: ${resizeDimensions},
    left: ${resizeDimensions},
 }
 THIS IS DEPRACATED AND WILL BE REMOVED IN A NEW MAJOR RELEASE
#####################################################################################
`));
	} else {
		resizeValues = resizeDimensions;
	}

	const resize = { ...DEFAULT_RESIZE_DIMENSIONS, ...resizeValues };
	const width = rectangles.width + resize.left + resize.right;
	const height = rectangles.height + resize.top + resize.bottom;
	const canvas = createCanvas(width, height);
	const image = await loadImage(`data:image/png;base64,${base64Image}`);
	const ctx = canvas.getContext('2d');

	let sourceXStart = rectangles.x - resize.left;
	let sourceYStart = rectangles.y - resize.top;

	if (sourceXStart < 0) {
		console.log(yellow(`
#####################################################################################
 THE RESIZE DIMENSION LEFT '${resize.left}' MADE THE CROPPING GO OUT OF
 THE IMAGE BOUNDARIES RESULTING IN AN IMAGE STARTPOSITION '${sourceXStart}'.
 THIS HAS BEEN DEFAULTED TO '0'
#####################################################################################
`));
		sourceXStart = 0;
	}

	if (sourceYStart < 0) {
		console.log(yellow(`
#####################################################################################
 THE RESIZE DIMENSION LEFT '${resize.top}' MADE THE CROPPING GO OUT OF
 THE IMAGE BOUNDARIES RESULTING IN AN IMAGE STARTPOSITION '${sourceYStart}'.
 THIS HAS BEEN DEFAULTED TO '0'
#####################################################################################
`));
		sourceYStart = 0;
	}

	ctx.drawImage(image,
		// Start at x/y pixels from the left and the top of the image (crop)
		sourceXStart, sourceYStart,
		// 'Get' a (w * h) area from the source image (crop)
		width, height,
		// Place the result at 0, 0 in the canvas,
		0, 0,
		// With as width / height: 100 * 100 (scale)
		width, height
	);

	return canvas.toDataURL().replace(/^data:image\/png;base64,/, '');
}
