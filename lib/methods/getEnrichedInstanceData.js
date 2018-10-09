import { platformIsAndroid, platformIsIos } from "../helpers/utils";
import getScreenDimensions from "../cliendSideScripts/getScreenDimensions";

/**
 * Enrich the instance data with more data
 *
 * @param {function}  executor      The function to execute JS in the browser
 * @param {object}    options       The options
 * @param {object}    instanceData  Current instance data
 *
 * @returns {
 *    {
 *      dimensions: {
 *        body: {
 *          scrollHeight: number,
 *          offsetHeight: number
 *        },
 *        html: {
 *          clientWidth: number,
 *          scrollWidth: number,
 *          clientHeight: number,
 *          scrollHeight: number,
 *          offsetHeight: number
 *        },
 *        window: {
 *          innerWidth: number,
 *          innerHeight: number,
 *          outerWidth: number,
 *          outerHeight: number,
 *          devicePixelRatio: number,
 *          screenWidth: number,
 *          screenHeight: number
 *        }
 *      },
 *      browserName: string,
 *      deviceName: string,
 *      logName: string,
 *      name: string,
 *      nativeWebScreenshot: boolean,
 *      platformName: string,
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
export default async function getEnrichedInstanceData(executor, options, instanceData){
  // Get the current browser data
  const browserData = await executor(getScreenDimensions);

  // Determine some constants
  const isAndroid = platformIsAndroid(instanceData.platformName);
  const isIos = platformIsIos(instanceData.platformName);
  const isMobile = instanceData.platformName !== '';
  const testInBrowser = instanceData.browserName !== '';
  const testInMobileBrowser = isMobile && testInBrowser;
  // nativeWebScreenshot of the constructor can be overruled by the capabilities when the constructor value is false
  const isNativeWebScreenshot = !options.nativeWebScreenshot ? !!instanceData.nativeWebScreenshot : options.nativeWebScreenshot;
  const addressBarShadowPadding = (testInMobileBrowser && ((isNativeWebScreenshot && isAndroid) || isIos)) ? options.addressBarShadowPadding : 0;
  const toolBarShadowPadding = (testInMobileBrowser && isIos) ? options.toolBarShadowPadding : 0;

  // Return the new instance data object
  return {
    ...(browserData),
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
