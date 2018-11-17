import { join, normalize } from 'path';
import * as assert from 'assert';
import { ensureDirSync } from 'fs-extra';
import { defaultOptions } from "./helpers/options";
import { FOLDERS } from "./helpers/constants";

export default class BaseClass {
  constructor(options) {
    // determine default options
    this.defaultOptions = defaultOptions(options);

    // Setup the folders
    assert.ok(options.baselineFolder, 'Image baselineFolder not given.');
    assert.ok(options.screenshotPath, 'Image screenshotPath not given.');

    const baselineFolder = normalize(options.baselineFolder);
    const baseFolder = normalize(options.screenshotPath);

    this.folders = {
      actualFolder: join(baseFolder, FOLDERS.ACTUAL),
      baselineFolder,
      diffFolder: join(baseFolder, FOLDERS.DIFF),
      tempFullScreenFolder: join(baseFolder, FOLDERS.TEMP_FULL_SCREEN),
    };

    // Create them if needed
    ensureDirSync(this.folders.actualFolder);
    ensureDirSync(this.folders.baselineFolder);
    ensureDirSync(this.folders.diffFolder);

    if (defaultOptions.debug) {
      ensureDirSync(this.folders.tempFullScreenFolder);
    }
  }
}
