import BaseClass from './base';
import saveElement from './commands/saveElement';
import saveScreen from './commands/saveScreen';

export default class ProtractorImageComparison extends BaseClass {
  constructor(options) {
    super(options);
  }

  async saveElement(element, tag, options = {}) {
    browser.instanceData = browser.instanceData || await getInstanceData();

    return saveElement(
      {
        asyncExecutor: browser.executeAsyncScript,
        executor: browser.executeScript,
        screenShot: browser.takeScreenshot
      },
      browser.instanceData,
      this.folders,
      await element.getWebElement(),
      tag,
      {...this.defaultOptions, ...options},
    );
  }

  async saveScreen(tag, options = {}) {
    browser.instanceData = browser.instanceData || await getInstanceData();

    return saveScreen(
      {
        asyncExecutor: browser.executeAsyncScript,
        executor: browser.executeScript,
        screenShot: browser.takeScreenshot
      },
      browser.instanceData,
      this.folders,
      tag,
      {...this.defaultOptions, ...options},
    );
  }
}

/**
 * Get the instance data
 *
 * @returns {Promise<{
 *    browserName: string,
 *    deviceName: string,
 *    logName: string,
 *    name: string,
 *    nativeWebScreenshot: boolean,
 *    platformName: string
 *  }>}
 */
async function getInstanceData() {
  const instanceConfig = (await browser.getProcessedConfig()).capabilities;

  // Substract the needed data from the running instance
  const browserName = (instanceConfig.browserName || '').toLowerCase();
  const logName = instanceConfig.logName || '';
  const name = instanceConfig.name || '';

  // For mobile
  const platformName = (instanceConfig.platformName || '').toLowerCase();
  const deviceName = (instanceConfig.deviceName || '').toLowerCase();
  const nativeWebScreenshot = !!instanceConfig.nativeWebScreenshot;

  return {
    browserName,
    deviceName,
    logName,
    name,
    nativeWebScreenshot,
    platformName,
  }
}
