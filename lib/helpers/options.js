import {
	DEFAULT_FORMAT_STRING,
	DEFAULT_RESIZE_DIMENSIONS,
	DEFAULT_SHADOW,
	FULL_PAGE_SCROLL_TIMEOUT,
} from './constants';

export function defaultOptions(options) {
	return {
		/**
		 * Module options
		 */
		addressBarShadowPadding: options.addressBarShadowPadding || DEFAULT_SHADOW.ADDRESS_BAR,
		autoSaveBaseline: options.autoSaveBaseline || false,
		debug: options.debug || false,
		formatString: options.formatString || DEFAULT_FORMAT_STRING,
		nativeWebScreenshot: !!options.nativeWebScreenshot,
		savePerInstance: options.savePerInstance || false,
		toolBarShadowPadding: options.toolBarShadowPadding || DEFAULT_SHADOW.TOOL_BAR,

		/**
		 * Method options
		 */
		resizeDimensions: options.resizeDimensions || DEFAULT_RESIZE_DIMENSIONS,

		/**
		 * Module and method options
		 */
		disableCSSAnimation: options.disableCSSAnimation || false,
		fullPageScrollTimeout: options.fullPageScrollTimeout || FULL_PAGE_SCROLL_TIMEOUT,
		hideScrollBars: options.hideScrollBars !== false,
		// Compare options
		compareOptions: {
			blockOutStatusBar: !!options.blockOutStatusBar,
			ignoreAlpha: options.ignoreAlpha || false,
			ignoreAntialiasing: options.ignoreAntialiasing || false,
			ignoreColors: options.ignoreColors || false,
			ignoreLess: options.ignoreLess || false,
			ignoreNothing: options.ignoreNothing || false,
			ignoreTransparentPixel: options.ignoreTransparentPixel || false,
			rawMisMatchPercentage: options.rawMisMatchPercentage || false,
			returnAllCompareData: options.returnAllCompareData || false,
			saveAboveTolerance: options.saveAboveTolerance || 0,
		},
	}
}
