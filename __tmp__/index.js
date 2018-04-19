const camelCase = require('camel-case');
import {ensureDirSync} from 'fs-extra';
import {ok} from 'assert';
import {join, normalize} from 'path';
import * as PNGImage from 'png-image';
import {calculateDprRectangles, getBufferedScreenshot, isMobile} from './utils';
import {SAVE_TYPE} from "./constants";
import {Rectangles, SaveCroppedScreenshotOptions, SaveScreenOptions} from "./interfaces";
import {initSaveScreenOptions} from "./initOptions";
import {getCurrentInstanceData, setCustomTestCSS} from "./currentInstance";

export class protractorImageComparison {
  private disableCSSAnimation: boolean;
  private baselineFolder: string;
  private baseFolder: string;
  // private autoSaveBaseline: boolean;
  private debug: boolean;
  private hideScrollBars: boolean;
  private formatString: string;
  private nativeWebScreenshot: boolean;
  // private blockOutStatusBar: boolean;
  // private ignoreAntialiasing: boolean;
  // private ignoreColors: boolean;
  // private ignoreTransparentPixel: boolean;
  private actualFolder: string;
  private addressBarShadowPadding: number;
  // private androidOffsets: any;
  private browserHeight: number;
  private browserWidth: number;
  private browserName: string;
  private deviceName: string;
  private diffFolder: string;
  private devicePixelRatio: number;
  // private fullPageHeight: number;
  // private fullPageWidth: number;
  // private formatOptions: any;
  // private iosOffsets: any;
  // private isLastScreenshot: boolean;
  private logName: string;
  private name: string;
  private platformName: string;
  // private resizeDimensions: number;
  // private screenshotHeight: number;
  private tempFullScreenFolder: string;
  // private fullPageScrollTimeout: number;
  private testInBrowser: boolean;
  private toolBarShadowPadding: number;
  // private viewPortHeight: number;
  // private viewPortWidth: number;

  constructor(options: any) {
    ok(options.baselineFolder, 'Image baselineFolder not given.');
    ok(options.screenshotPath, 'Image screenshotPath not given.');

    this.baselineFolder = normalize(options.baselineFolder);
    this.baseFolder = normalize(options.screenshotPath);
    // this.autoSaveBaseline = options.autoSaveBaseline || false;
    this.debug = options.debug || false;
    this.disableCSSAnimation = options.disableCSSAnimation || false;
    this.hideScrollBars = options.hideScrollBars !== false;
    this.formatString = options.formatImageName || '{tag}-{browserName}-{width}x{height}-dpr-{dpr}';

    this.nativeWebScreenshot = !!options.nativeWebScreenshot;
    // this.blockOutStatusBar = !!options.blockOutStatusBar;

    // this.ignoreAntialiasing = options.ignoreAntialiasing || false;
    // this.ignoreColors = options.ignoreColors || false;
    // this.ignoreTransparentPixel = options.ignoreTransparentPixel || false;

    // OS offsets
    // let androidOffsets = options.androidOffsets && typeof options.androidOffsets === 'object' ? options.androidOffsets : {};
    // let iosOffsets = options.iosOffsets && typeof options.iosOffsets === 'object' ? options.iosOffsets : {};

    // let androidDefaultOffsets = {
    //   statusBar: 24,
    //   addressBar: 56,
    //   addressBarScrolled: 0,
    //   toolBar: 48
    // };
    // let iosDefaultOffsets = {
    //   statusBar: 20,
    //   addressBar: 44,
    //   addressBarScrolled: 19,
    //   toolBar: 44
    // };

    this.actualFolder = join(this.baseFolder, 'actual');
    this.addressBarShadowPadding = 6;
    // this.androidOffsets = protractorImageComparison._mergeDefaultOptions(androidDefaultOffsets, androidOffsets);
    this.browserHeight = 0;
    this.browserName = '';
    this.browserWidth = 0;
    this.deviceName = '';
    this.diffFolder = join(this.baseFolder, 'diff');
    this.devicePixelRatio = 1;
    // this.formatOptions = options.formatImageOptions || {};
    // this.fullPageHeight = 0;
    // this.fullPageWidth = 0;
    // this.iosOffsets = protractorImageComparison._mergeDefaultOptions(iosDefaultOffsets, iosOffsets);
    // this.isLastScreenshot = false;
    this.logName = '';
    this.name = '';
    this.platformName = '';
    // this.resizeDimensions = 0;
    // this.screenshotHeight = 0;
    this.tempFullScreenFolder = join(this.baseFolder, 'tempFullScreen');
    // this.fullPageScrollTimeout = 1500;
    this.testInBrowser = false;
    this.toolBarShadowPadding = 6;
    // this.viewPortHeight = 0;
    // this.viewPortWidth = 0;

    ensureDirSync(this.actualFolder);
    ensureDirSync(this.baselineFolder);
    ensureDirSync(this.diffFolder);

    if (this.debug) {
      ensureDirSync(this.tempFullScreenFolder);
    }
  }

  /**
   * Merges non-default options from optionsB into optionsA
   *
   * @method mergeDefaultOptions
   * @param {object} optionsA
   * @param {object} optionsB
   * @return {object}
   * @private
   */
  _mergeDefaultOptions(optionsA: any, optionsB: any): any {
    optionsB = (typeof optionsB === 'object') ? optionsB : {};

    for (let option in optionsB) {
      if (optionsA.hasOwnProperty(option)) {
        optionsA[option] = optionsB[option];
      }
    }

    return optionsA;
  }

  /**
   * Save a cropped screenshot
   * @param {SaveCroppedScreenshotOptions} args
   * @return {Promise<void>}
   */
  _saveCroppedScreenshot(args: SaveCroppedScreenshotOptions): Promise<void> {
    console.log('join(args.folder, this._formatFileName(args)) = ',join(args.folder, this._formatFileName(args)))
    console.log('args.rectangles = ',args.rectangles)
    return new PNGImage({
      imagePath: args.bufferedScreenshot,
      imageOutputPath: join(args.folder, this._formatFileName(args)),
      cropImage: args.rectangles
    }).runWithPromise();
  }

  /**
   * _formatFileName
   * @param {string} tag The tag that is used
   * @returns {string} Returns a formatted string
   * @private
   */
  _formatFileName(args) {
    let defaults = {
      'browserName': args.browserName,
      'deviceName': args.deviceName,
      'dpr': args.devicePixelRatio,
      'height': args.browserHeight,
      'logName': camelCase(args.logName),
      'mobile': args.isMobile && args.testInBrowser ? args.browserName : args.isMobile ? 'app' : '',
      'name': args.name,
      'tag': args.tag,
      'width': args.browserWidth
    };
    let formatString = args.formatString;

    defaults = this._mergeDefaultOptions(defaults, {});

    Object.keys(defaults).forEach(function (value) {
      formatString = formatString.replace(`{${value}}`, defaults[value]);
    });

    return formatString + '.png';
  }

  /**
   * Saves an image of the screen
   *
   * @method saveScreen
   *
   * @example
   * // Default
   * browser.protractorImageComparison.saveScreen('imageA');
   * // Disable css animation on all elements
   * browser.protractorImageComparison.saveScreen('imageA',{disableCSSAnimation: true});
   *
   * @param {string} tag The tag that is used
   * @param {SaveScreenOptions} options (non-default) options
   * @param {boolean} options.disableCSSAnimation enable or disable CSS animation
   * @param {boolean} options.hideScrollBars hide or show scrollbars
   * @return {Promise<void>}
   * @public
   */
  public async saveScreen(tag: string, options?: SaveScreenOptions): Promise<void> {
    const saveScreenOptions: SaveScreenOptions = initSaveScreenOptions(
      this.disableCSSAnimation,
      this.hideScrollBars,
      options
    );
    SAVE_TYPE.screen = true;
    const instanceData = await getCurrentInstanceData({
      SAVE_TYPE,
      devicePixelRatio: this.devicePixelRatio,
      testInBrowser: this.testInBrowser,
      nativeWebScreenshot: this.nativeWebScreenshot,
      addressBarShadowPadding: this.addressBarShadowPadding,
      toolBarShadowPadding: this.toolBarShadowPadding
    });

    // Set some CSS
    await setCustomTestCSS({
      addressBarShadowPadding: instanceData.addressBarShadowPadding,
      disableCSSAnimation: saveScreenOptions.disableCSSAnimation,
      hideScrollBars: saveScreenOptions.hideScrollBars,
      toolBarShadowPadding: instanceData.toolBarShadowPadding
    });

    // Create a screenshot and save it as a buffer
    const bufferedScreenshot: Buffer = await getBufferedScreenshot();
    const screenshotHeight: number = (bufferedScreenshot.readUInt32BE(20) / instanceData.devicePixelRatio); // width = 16
    const rectangles: Rectangles = calculateDprRectangles({
      height: screenshotHeight > instanceData.viewPortHeight ? screenshotHeight : instanceData.viewPortHeight,
      width: instanceData.viewPortWidth,
      x: 0,
      y: 0
    }, instanceData.devicePixelRatio);

    await this._saveCroppedScreenshot({
      browserHeight: instanceData.browserHeight,
      browserName: instanceData.browserName,
      browserWidth: instanceData.browserWidth,
      bufferedScreenshot,
      deviceName: instanceData.deviceName,
      devicePixelRatio: instanceData.devicePixelRatio,
      folder: this.actualFolder,
      formatString: this.formatString,
      isMobile: isMobile(instanceData.platformName),
      name: instanceData.name,
      logName: instanceData.logName,
      rectangles,
      tag,
      testInBrowser: instanceData.testInBrowser,
    });
  }
}
