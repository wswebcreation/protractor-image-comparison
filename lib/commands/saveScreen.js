import { calculateDprRectangles, formatFileName } from "../helpers/utils";
import { enrichInstanceData } from "../helpers/utils";
import getScreenDimensions from "../cliendSideScripts/getScreenDimensions";
import { takeBufferedScreenShot } from "../helpers/screenshot";
import { saveCanvas } from "../helpers/saveCanvas";

/**
 * Saves an image of the screen
 *
 * @param   {object}  methods       The tag that is used
 * @param   {object}  instanceData  ..
 * @param   {object}  folders       ..
 * @param   {string}  tag           The tag that is used
 * @param   {object}  options       ..
 *
 *
 * @returns {Promise}
 */
export default async function saveScreen(methods, instanceData, folders, tag, options) {
  const browserData = await methods.executor(getScreenDimensions);
  const enrichedInstanceData = {...enrichInstanceData(options, instanceData), ...browserData};

  console.log('enrichedInstanceData = ', enrichedInstanceData);

  const fileName = formatFileName(options.formatString, tag, enrichedInstanceData);

  console.log('fileName = ', fileName);

  const screenshot = await takeBufferedScreenShot(methods.screenShot);
  const screenshotHeight = (new Buffer(screenshot, 'base64').readUInt32BE(20) / enrichedInstanceData.dimensions.window.devicePixelRatio); // width = 16
  const innerHeight = enrichedInstanceData.dimensions.window.innerHeight;
  const innerWidth = enrichedInstanceData.dimensions.window.innerWidth;
  const rectangles = calculateDprRectangles({
    height: screenshotHeight > innerHeight ? screenshotHeight : innerHeight,
    width: innerWidth,
    x: 0,
    y: 0
  }, enrichedInstanceData.dimensions.window.devicePixelRatio);

  console.log('rectangles = ', rectangles);

  return saveCanvas(screenshot, rectangles, fileName, folders);
}
