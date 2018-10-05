/**
 * Take a buffered screenshot
 *
 * @param {function}  takeScreenshot the screenshot method
 *
 * @returns {Promise<Buffer>}
 */
export async function takeBufferedScreenShot(takeScreenshot) {
  // return new Buffer(await takeScreenshot(), 'base64');
  return await takeScreenshot();
}
