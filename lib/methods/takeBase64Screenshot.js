/**
 * Take a screenshot
 *
 * @param {function} takeScreenshot The screenshot method
 *
 * @returns {Promise<string>}
 */
export default async function takeBase64Screenshot(takeScreenshot) {
  return takeScreenshot();
}
