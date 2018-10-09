import { calculateDprRectangles } from "../helpers/utils";

export default function determineRectangles(screenshot, instanceData) {
  // Determine screenshot data
  const screenshotHeight = (new Buffer(screenshot, 'base64').readUInt32BE(20) / instanceData.dimensions.window.devicePixelRatio); // width = 16
  const innerHeight = instanceData.dimensions.window.innerHeight;
  const innerWidth = instanceData.dimensions.window.innerWidth;

  // Determine the rectangles
  return calculateDprRectangles({
    height: screenshotHeight > innerHeight ? screenshotHeight : innerHeight,
    width: innerWidth,
    x: 0,
    y: 0
  }, instanceData.dimensions.window.devicePixelRatio);
}
