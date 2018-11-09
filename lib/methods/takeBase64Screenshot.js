/**
 * Take a screenshot
 *
 * @param {function} takeScreenshot the screenshot method
 *
 * @returns {Promise<string>}
 */
export async function takeBase64Screenshot(takeScreenshot) {
  return takeScreenshot();
}
