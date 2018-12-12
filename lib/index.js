import ProtractorImageComparison from './protractor.image.compare';

/**
 * Sets up plugins before tests are run. This is called after the WebDriver
 * session has been started, but before the test framework has been set up.
 *
 * @param {object} options The options of the module
 *
 * @return {Promise<void>}
 */
async function setup(options) {
	browser.imageCompare = new ProtractorImageComparison({
		...(this.config.options.addressBarShadowPadding ? { addressBarShadowPadding: this.config.options.addressBarShadowPadding } : {}),
		...(this.config.options.baselineFolder ? { baselineFolder: this.config.options.baselineFolder } : {}),
		...(this.config.options.debug ? { debug: this.config.options.debug } : {}),
		...(this.config.options.disableCSSAnimation ? { disableCSSAnimation: this.config.options.disableCSSAnimation } : {}),
		...(this.config.options.formatImageName ? { formatString: this.config.options.formatImageName } : {}),
		...(this.config.options.fullPageScrollTimeout ? { fullPageScrollTimeout: this.config.options.fullPageScrollTimeout } : {}),
		...(this.config.options.hideScrollBars ? { hideScrollBars: this.config.options.hideScrollBars } : {}),
		...(this.config.options.nativeWebScreenshot ? { nativeWebScreenshot: this.config.options.nativeWebScreenshot } : {}),
		...(this.config.options.savePerInstance ? { savePerInstance: this.config.options.savePerInstance } : {}),
		...(this.config.options.screenshotPath ? { screenshotPath: this.config.options.screenshotPath } : {}),
		...(this.config.options.toolBarShadowPadding ? { toolBarShadowPadding: this.config.options.toolBarShadowPadding } : {}),

		// compareOptions:
		...(this.config.options.autoSaveBaseline ? { autoSaveBaseline: this.config.options.autoSaveBaseline } : {}),
		...(this.config.options.blockOutStatusBar ? { blockOutStatusBar: this.config.options.blockOutStatusBar } : {}),
		...(this.config.options.blockOutToolBar ? { blockOutToolBar: this.config.options.blockOutToolBar } : {}),
		...(this.config.options.ignoreAlpha ? { ignoreAlpha: this.config.options.ignoreAlpha } : {}),
		...(this.config.options.ignoreAntialiasing ? { ignoreAntialiasing: this.config.options.ignoreAntialiasing } : {}),
		...(this.config.options.ignoreColors ? { ignoreColors: this.config.options.ignoreColors } : {}),
		...(this.config.options.ignoreLess ? { ignoreLess: this.config.options.ignoreLess } : {}),
		...(this.config.options.ignoreNothing ? { ignoreNothing: this.config.options.ignoreNothing } : {}),
		...(this.config.options.ignoreTransparentPixel ? { ignoreTransparentPixel: this.config.options.ignoreTransparentPixel } : {}),
		...(this.config.options.returnAllCompareData ? { returnAllCompareData: this.config.options.returnAllCompareData } : {}),
		...(this.config.options.rawMisMatchPercentage ? { rawMisMatchPercentage: this.config.options.rawMisMatchPercentage } : {}),
	});
}

exports.setup = setup;
