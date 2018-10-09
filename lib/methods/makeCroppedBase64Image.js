const Canvas = require('canvas-prebuilt');

/**
 * Make a cropped image with Canvas
 *
 * @param   {string}  base64Image The image in base64
 * @param   {object}  rectangles  The rectangles
 * @returns {string}
 */
export function makeCroppedBase64Image(base64Image, rectangles) {
  const CanvasImage = Canvas.Image;
  const image = new CanvasImage();
  let canvas;

  image.onerror = (err) => {
    throw err;
  };

  image.onload = () => {
    const width = rectangles.width;
    const height = rectangles.height;
    canvas = new Canvas(width, height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(image,
      // Start at x/y pixels from the left and the top of the image (crop)
      0, 0,
      // "Get" a (w * h) area from the source image (crop)
      width, height,
      // Place the result at 0, 0 in the canvas,
      0, 0,
      // With as width / height: 100 * 100 (scale)
      width, height
    );
  };
  image.src = `data:image/png;base64,${base64Image}`;

  return canvas.toDataURL().replace(/^data:image\/png;base64,/, '');
}
