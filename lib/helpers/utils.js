import { PLATFORMS } from "./constants";
import getScreenDimensions from "../cliendSideScripts/getScreenDimensions";

/**
 * Format the filename
 *
 * @param {string}  formatString  The format is needs to be
 * @param {string}  tag           The tag
 * @param {object}  instanceData  the data of the current running instance
 *
 * @returns {string}
 */
export function formatFileName(formatString, tag, instanceData) {
  let defaults = {
    'browserName': instanceData.browserName,
    'deviceName': instanceData.deviceName,
    'dpr': instanceData.dimensions.window.devicePixelRatio,
    'height': instanceData.dimensions.window.outerHeight,
    'logName': instanceData.logName,
    'mobile': (instanceData.isMobile && instanceData.testInBrowser) ? instanceData.browserName : instanceData.isMobile ? 'app' : '',
    'name': instanceData.name,
    'tag': tag,
    'width': instanceData.dimensions.window.outerWidth
  };

  Object.keys(defaults).forEach((value) => {
    formatString = formatString.replace(`{${value}}`, defaults[value]);
  });

  return `${formatString.replace(/ /g, '_').toLowerCase()}.png`;
}


/**
 * Checks if the os is Android
 *
 * @param {string} platformName
 *
 * @returns {boolean}
 */
export function platformIsAndroid(platformName) {
  return platformName.toLowerCase() === PLATFORMS.ANDROID;
}

/**
 * Checks if the os is IOS
 *
 * @param {string} platformName
 *
 * @returns {boolean}
 */
export function platformIsIos(platformName) {
  return platformName.toLowerCase() === PLATFORMS.IOS;
}

/**
 * Calculate the rectangles based on the device pixel ratio
 *
 * @param {object} rectangles
 * @param {number} devicePixelRatio
 *
 * @return {object}
 */
export function calculateDprRectangles(rectangles, devicePixelRatio) {
  Object.keys(rectangles).map((key) => rectangles[key] *= devicePixelRatio);

  return rectangles;
}
