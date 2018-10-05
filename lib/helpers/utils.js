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
 * Enrich the instance data with more data
 *
 * @param {object}    options       The options
 * @param {object}    instanceData  Current instance data
 *
 * @returns {
 *    {
 *      browserName: string,
 *      deviceName: string,
 *      logName: string,
 *      name: string,
 *      nativeWebScreenshot: boolean,
 *      platformName: string
 *      addressBarShadowPadding: number,
 *      isAndroid: boolean,
 *      isIos: boolean,
 *      isMobile: boolean,
 *      isNativeWebScreenshot: boolean,
 *      testInBrowser: boolean,
 *      testInMobileBrowser: boolean,
 *      toolBarShadowPadding: number,
 *    }
 *  }
 */
export function enrichInstanceData(options, instanceData) {
  const isAndroid = platformIsAndroid(instanceData.platformName);
  const isIos = platformIsIos(instanceData.platformName);
  const isMobile = instanceData.platformName !== '';
  const testInBrowser = instanceData.browserName !== '';
  const testInMobileBrowser = isMobile && testInBrowser;
  // nativeWebScreenshot of the constructor can be overruled by the capabilities when the constructor value is false
  const isNativeWebScreenshot = !options.nativeWebScreenshot ? !!instanceData.nativeWebScreenshot : options.nativeWebScreenshot;
  const addressBarShadowPadding = (testInMobileBrowser && ((isNativeWebScreenshot && isAndroid) || isIos)) ? options.addressBarShadowPadding : 0;
  const toolBarShadowPadding = (testInMobileBrowser && isIos) ? options.toolBarShadowPadding : 0;

  return {
    ...(instanceData),
    addressBarShadowPadding,
    isAndroid,
    isIos,
    isMobile,
    isNativeWebScreenshot,
    testInBrowser,
    testInMobileBrowser,
    toolBarShadowPadding,
  };
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
