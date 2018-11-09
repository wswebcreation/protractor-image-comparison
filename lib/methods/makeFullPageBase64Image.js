const { createCanvas, loadImage } = require('canvas');

/**
 * Make a full page image with Canvas
 *
 * @param {object} screenshotsData
 * @param {number} screenshotsData.fullPageHeight       Height of the canvas
 * @param {number} screenshotsData.fullPageWidth        Width of the canvas
 * @param {array}  screenshotsData.data                 the screenshots data
 * @param {number} screenshotsData.data.canvasWidth     width of the canvas
 * @param {number} screenshotsData.data.canvasYPosition y postion the screenshot needs to be placed in the canvas
 * @param {number} screenshotsData.data.imageHeight     height of the image
 * @param {number} screenshotsData.data.imageWidth      width of the image
 * @param {number} screenshotsData.data.imageYPosition  the y position for the image crop
 * @param {number} screenshotsData.data.screenshot      the screenshot
 *
 * @returns {string}
 */
export async function makeFullPageBase64Image(screenshotsData) {
	const amountOfScreenshots = screenshotsData.data.length;
	const canvasHeight = screenshotsData.fullPageHeight;
	const canvasWidth = screenshotsData.fullPageWidth;
	const canvas = createCanvas(canvasWidth, canvasHeight);
	const ctx = canvas.getContext('2d');

	// Load all the images
	for (let i = 0; i < amountOfScreenshots; i++) {
		const imageHeight = screenshotsData.data[ i ].imageHeight;
		const imageWidth = screenshotsData.data[ i ].imageWidth;
		const canvasYPosition = screenshotsData.data[ i ].canvasYPosition;
		const imageYPosition = screenshotsData.data[ i ].imageYPosition;
		const image = await loadImage(`data:image/png;base64,${screenshotsData.data[ i ].screenshot}`);

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
